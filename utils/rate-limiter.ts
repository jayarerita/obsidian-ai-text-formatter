/**
 * Rate Limiter Utility for AI Services
 * Helps prevent rate limiting errors by managing request timing
 */

interface RateLimitConfig {
	requestsPerMinute: number;
	burstLimit?: number;
	cooldownPeriod?: number;
}

export class RateLimiter {
	private requestTimes: number[] = [];
	private config: RateLimitConfig;
	private serviceName: string;

	constructor(serviceName: string, config: RateLimitConfig) {
		this.serviceName = serviceName;
		this.config = {
			burstLimit: 3,
			cooldownPeriod: 60000, // 1 minute
			...config,
		};
	}

	/**
	 * Check if a request can be made now, or how long to wait
	 */
	async checkRateLimit(): Promise<{ canProceed: boolean; waitTime: number }> {
		const now = Date.now();
		const windowStart = now - (this.config.cooldownPeriod || 60000);

		// Remove old requests outside the time window
		this.requestTimes = this.requestTimes.filter(
			(time) => time > windowStart
		);

		// Check if we're within limits
		if (this.requestTimes.length < this.config.requestsPerMinute) {
			return { canProceed: true, waitTime: 0 };
		}

		// Calculate wait time until oldest request expires
		const oldestRequest = Math.min(...this.requestTimes);
		const waitTime =
			oldestRequest + (this.config.cooldownPeriod || 60000) - now;

		return { canProceed: false, waitTime: Math.max(0, waitTime) };
	}

	/**
	 * Wait if necessary, then record the request
	 */
	async waitAndProceed(): Promise<void> {
		const { canProceed, waitTime } = await this.checkRateLimit();

		if (!canProceed && waitTime > 0) {
			// console.log(
			// 	`${this.serviceName}: Rate limiting - waiting ${waitTime}ms`
			// );
			await this.sleep(waitTime);
		}

		// Record this request
		this.requestTimes.push(Date.now());
	}

	/**
	 * Get current rate limit status
	 */
	getStatus(): {
		requestsInWindow: number;
		maxRequests: number;
		resetTime: number;
	} {
		const now = Date.now();
		const cooldownPeriod = this.config.cooldownPeriod || 60000;
		const windowStart = now - cooldownPeriod;
		const requestsInWindow = this.requestTimes.filter(
			(time) => time > windowStart
		).length;
		const oldestRequest = Math.min(
			...this.requestTimes.filter((time) => time > windowStart)
		);
		const resetTime = oldestRequest + cooldownPeriod;

		return {
			requestsInWindow,
			maxRequests: this.config.requestsPerMinute,
			resetTime,
		};
	}

	/**
	 * Reset the rate limiter (useful for testing or manual reset)
	 */
	reset(): void {
		this.requestTimes = [];
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

/**
 * Pre-configured rate limiters for different AI services
 */
export const RateLimiters = {
	OpenAI: {
		free: new RateLimiter("OpenAI-Free", { requestsPerMinute: 3 }),
		paid: new RateLimiter("OpenAI-Paid", { requestsPerMinute: 60 }),
	},

	Claude: {
		free: new RateLimiter("Claude-Free", { requestsPerMinute: 5 }),
		paid: new RateLimiter("Claude-Paid", { requestsPerMinute: 100 }),
	},

	Gemini: {
		free: new RateLimiter("Gemini-Free", { requestsPerMinute: 15 }),
		paid: new RateLimiter("Gemini-Paid", { requestsPerMinute: 300 }),
	},
};

/**
 * Exponential backoff utility for retry logic
 */
export class ExponentialBackoff {
	private attempt = 0;
	private maxAttempts: number;
	private baseDelay: number;
	private maxDelay: number;

	constructor(maxAttempts = 3, baseDelay = 1000, maxDelay = 30000) {
		this.maxAttempts = maxAttempts;
		this.baseDelay = baseDelay;
		this.maxDelay = maxDelay;
	}

	/**
	 * Get delay for current attempt
	 */
	getDelay(): number {
		if (this.attempt >= this.maxAttempts) {
			return 0;
		}

		const delay = Math.min(
			this.baseDelay * Math.pow(2, this.attempt),
			this.maxDelay
		);

		// Add jitter to prevent thundering herd
		const jitter = Math.random() * 0.1 * delay;
		return Math.floor(delay + jitter);
	}

	/**
	 * Wait for the calculated delay
	 */
	async wait(): Promise<boolean> {
		if (this.attempt >= this.maxAttempts) {
			return false;
		}

		const delay = this.getDelay();
		this.attempt++;

		if (delay > 0) {
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		return true;
	}

	/**
	 * Reset the backoff counter
	 */
	reset(): void {
		this.attempt = 0;
	}

	/**
	 * Check if we can still retry
	 */
	canRetry(): boolean {
		return this.attempt < this.maxAttempts;
	}
}

/**
 * Utility to parse Retry-After header from HTTP responses
 */
export function parseRetryAfter(retryAfterHeader: string | null): number {
	if (!retryAfterHeader) {
		return 0;
	}

	// Try parsing as seconds
	const seconds = parseInt(retryAfterHeader, 10);
	if (!isNaN(seconds)) {
		return seconds * 1000; // Convert to milliseconds
	}

	// Try parsing as HTTP date
	const date = new Date(retryAfterHeader);
	if (!isNaN(date.getTime())) {
		return Math.max(0, date.getTime() - Date.now());
	}

	return 0;
}

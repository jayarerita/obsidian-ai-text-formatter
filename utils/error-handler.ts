import { Notice } from "obsidian";

export enum ErrorType {
	CONFIGURATION = "configuration",
	NETWORK = "network",
	API = "api",
	VALIDATION = "validation",
	PROCESSING = "processing",
}

export interface ErrorInfo {
	type: ErrorType;
	message: string;
	details?: string;
	recoverable: boolean;
}

export class ErrorHandler {
	static handleError(error: Error | string, context?: string): ErrorInfo {
		const errorMessage = typeof error === "string" ? error : error.message;

		// Determine error type and create appropriate response
		if (
			errorMessage.includes("API key") ||
			errorMessage.includes("not configured")
		) {
			return this.handleConfigurationError(errorMessage);
		} else if (
			errorMessage.includes("Network") ||
			errorMessage.includes("fetch")
		) {
			return this.handleNetworkError(errorMessage);
		} else if (
			errorMessage.includes("API error") ||
			errorMessage.includes("HTTP")
		) {
			return this.handleAPIError(errorMessage, context);
		} else if (
			errorMessage.includes("text provided") ||
			errorMessage.includes("too long")
		) {
			return this.handleValidationError(errorMessage);
		} else {
			return this.handleProcessingError(errorMessage);
		}
	}

	static handleConfigurationError(message: string): ErrorInfo {
		return {
			type: ErrorType.CONFIGURATION,
			message: "Configuration Error",
			details:
				message +
				"\n\nPlease check your API key settings and ensure you have selected a valid AI service.",
			recoverable: true,
		};
	}

	static handleNetworkError(message: string): ErrorInfo {
		return {
			type: ErrorType.NETWORK,
			message: "Network Error",
			details:
				message +
				"\n\nPlease check your internet connection and try again.",
			recoverable: true,
		};
	}

	static handleAPIError(message: string, service?: string): ErrorInfo {
		const serviceInfo = service ? ` (${service})` : "";
		return {
			type: ErrorType.API,
			message: `AI Service Error${serviceInfo}`,
			details:
				message +
				"\n\nThe AI service returned an error. Please check your API key and try again.",
			recoverable: true,
		};
	}

	static handleValidationError(message: string): ErrorInfo {
		return {
			type: ErrorType.VALIDATION,
			message: "Input Validation Error",
			details: message,
			recoverable: true,
		};
	}

	static handleProcessingError(message: string): ErrorInfo {
		return {
			type: ErrorType.PROCESSING,
			message: "Processing Error",
			details:
				message +
				"\n\nAn unexpected error occurred during text processing.",
			recoverable: false,
		};
	}

	static showUserNotification(errorInfo: ErrorInfo): void {
		const noticeMessage = `${errorInfo.message}: ${errorInfo.details}`;
		new Notice(noticeMessage, 8000); // Show for 8 seconds
	}

	static showSimpleNotification(
		message: string,
		type: "error" | "warning" | "info" = "error"
	): void {
		const duration = type === "error" ? 8000 : 5000;
		new Notice(message, duration);
	}

	static validateApiKey(
		service: string,
		apiKey: string
	): { valid: boolean; message?: string } {
		if (!apiKey || apiKey.trim().length === 0) {
			return {
				valid: false,
				message: `${service} API key is required`,
			};
		}

		switch (service.toLowerCase()) {
			case "openai":
				if (!apiKey.startsWith("sk-")) {
					return {
						valid: false,
						message: 'OpenAI API key should start with "sk-"',
					};
				}
				break;
			case "claude":
				if (!apiKey.startsWith("sk-ant-")) {
					return {
						valid: false,
						message: 'Claude API key should start with "sk-ant-"',
					};
				}
				break;
			case "gemini":
				if (apiKey.length < 10) {
					return {
						valid: false,
						message: "Gemini API key appears to be too short",
					};
				}
				break;
		}

		return { valid: true };
	}

	static validateTextInput(
		text: string,
		maxLength = 10000
	): { valid: boolean; message?: string } {
		if (!text || text.trim().length === 0) {
			return {
				valid: false,
				message: "Please select some text to reformat",
			};
		}

		if (text.length > maxLength) {
			return {
				valid: false,
				message: `Selected text is too long (${text.length} characters). Maximum allowed: ${maxLength} characters.`,
			};
		}

		return { valid: true };
	}

	static async withRetry<T>(
		operation: () => Promise<T>,
		maxRetries = 3,
		delay = 1000
	): Promise<T> {
		let lastError: Error | undefined;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError =
					error instanceof Error ? error : new Error(String(error));

				// Don't retry on configuration errors
				if (
					lastError.message.includes("API key") ||
					lastError.message.includes("not configured")
				) {
					throw lastError;
				}

				if (attempt === maxRetries) {
					break;
				}

				// Show retry notification
				ErrorHandler.showSimpleNotification(
					`Attempt ${attempt} failed, retrying... (${
						maxRetries - attempt
					} attempts left)`,
					"warning"
				);

				// Exponential backoff
				const waitTime = delay * Math.pow(2, attempt - 1);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}

		throw lastError || new Error("Operation failed after maximum retries");
	}

	static handleRateLimitError(
		service: string,
		retryAfter?: number
	): ErrorInfo {
		const waitTime = retryAfter
			? `Please wait ${Math.ceil(
					retryAfter / 1000 )} seconds before trying again.`
			: "Please wait a moment before trying again.";
		const upgradeMessage =
			service === "OpenAI"
				? " Consider upgrading your OpenAI plan for higher rate limits."
				: ` Consider upgrading your ${service} plan for higher rate limits.`;

		return {
			type: ErrorType.API,
			message: `${service} Rate Limit Exceeded`,
			details: `You've exceeded the ${service} API rate limit. ${waitTime}${upgradeMessage}`,
			recoverable: true,
		};
	}

	static handleQuotaExceededError(service: string): ErrorInfo {
		const billingMessage =
			service === "OpenAI"
				? "Please check your OpenAI billing and usage limits at https://platform.openai.com/usage"
				: `Please check your ${service} billing and usage limits.`;

		return {
			type: ErrorType.API,
			message: `${service} API Quota Exceeded`,
			details: `Your ${service} API quota has been exceeded. ${billingMessage}`,
			recoverable: false,
		};
	}

	static showRateLimitNotification(service: string, waitTime?: number): void {
		const message = waitTime
			? `⏱️ ${service} rate limit reached. Retrying in ${Math.ceil(
					waitTime / 1000 )} seconds...`
			: `⏱️ ${service} rate limit reached. Please wait before making more requests.`;

		this.showSimpleNotification(message, "warning");
	}

	static handleInvalidResponseError(service: string): ErrorInfo {
		return {
			type: ErrorType.PROCESSING,
			message: "Invalid AI Response",
			details: `${service} returned an invalid or empty response. Please try again.`,
			recoverable: true,
		};
	}

	static isRetryableError(error: Error): boolean {
		const message = error.message.toLowerCase();

		// Network errors are retryable
		if (
			message.includes("network") ||
			message.includes("fetch") ||
			message.includes("timeout")
		) {
			return true;
		}

		// Some API errors are retryable
		if (
			message.includes("rate limit") ||
			message.includes("server error") ||
			message.includes("503") ||
			message.includes("502")
		) {
			return true;
		}

		// Configuration and validation errors are not retryable
		if (
			message.includes("api key") ||
			message.includes("not configured") ||
			message.includes("validation")
		) {
			return false;
		}

		return false;
	}

	static getErrorGuidance(errorInfo: ErrorInfo): string {
		switch (errorInfo.type) {
			case ErrorType.CONFIGURATION:
				return "Go to Settings → AI Text Formatter to configure your API keys.";
			case ErrorType.NETWORK:
				return "Check your internet connection and try again.";
			case ErrorType.API:
				if (errorInfo.details?.includes("rate limit")) {
					return "Wait a few minutes before making more requests.";
				} else if (errorInfo.details?.includes("quota")) {
					return "Check your API billing and usage limits.";
				} else {
					return "Verify your API key is valid and has sufficient permissions.";
				}
			case ErrorType.VALIDATION:
				return "Select a smaller amount of text or check your input.";
			case ErrorType.PROCESSING:
				return "Try again or contact support if the problem persists.";
			default:
				return "Please try again or restart Obsidian if the problem continues.";
		}
	}
}

import { AIResponse } from '../types';

export abstract class BaseAIService {
    protected apiKey: string;
    protected maxTokens: number;
    private lastRequestTime = 0;
    private minRequestInterval = 1000; // Minimum 1 second between requests

    constructor(apiKey: string, maxTokens = 4000) {
        this.apiKey = apiKey;
        this.maxTokens = maxTokens;
    }

    abstract generateText(prompt: string): Promise<AIResponse>;
    
    abstract validateApiKey(): boolean;
    
    abstract getMaxTokens(): number;
    
    abstract getServiceName(): string;

    protected createSuccessResponse(content: string, tokensUsed?: number): AIResponse {
        return {
            success: true,
            content,
            tokensUsed
        };
    }

    protected createErrorResponse(error: string): AIResponse {
        return {
            success: false,
            error
        };
    }

    protected async makeHttpRequest(url: string, options: RequestInit): Promise<Response> {
        // Rate limiting: ensure minimum interval between requests
        await this.enforceRateLimit();
        
        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                //console.log(`${this.getServiceName()}: Making request (attempt ${attempt}/${maxRetries})`);
                
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });
                
                // Handle rate limiting (429) with exponential backoff
                if (response.status === 429) {
                    const retryAfter = this.getRetryAfterDelay(response, attempt);
                    //console.log(`${this.getServiceName()}: Rate limited, waiting ${retryAfter}ms before retry`);
                    
                    if (attempt < maxRetries) {
                        await this.sleep(retryAfter);
                        continue;
                    } else {
                        throw new Error(`Rate limit exceeded. Please wait before making more requests.`);
                    }
                }
                
                // Handle other server errors with retry
                if (response.status >= 500 && response.status < 600) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
                    //console.log(`${this.getServiceName()}: Server error ${response.status}, waiting ${delay}ms before retry`);
                    
                    if (attempt < maxRetries) {
                        await this.sleep(delay);
                        continue;
                    }
                }
                
                // Update last request time for rate limiting
                this.lastRequestTime = Date.now();
                
                return response;
                
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                console.error(`${this.getServiceName()}: Request attempt ${attempt} failed:`, lastError.message);
                
                // Don't retry on certain errors
                if (this.isNonRetryableError(lastError)) {
                    throw lastError;
                }
                
                // Wait before retry (except on last attempt)
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
                    //console.log(`${this.getServiceName()}: Waiting ${delay}ms before retry`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw new Error(`Network request failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
    }

    private async enforceRateLimit(): Promise<void> {
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
            const waitTime = this.minRequestInterval - timeSinceLastRequest;
            //console.log(`${this.getServiceName()}: Rate limiting - waiting ${waitTime}ms`);
            await this.sleep(waitTime);
        }
    }

    private getRetryAfterDelay(response: Response, attempt: number): number {
        // Check for Retry-After header
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
            const seconds = parseInt(retryAfter, 10);
            if (!isNaN(seconds)) {
                return seconds * 1000; // Convert to milliseconds
            }
        }
        
        // Fallback to exponential backoff
        return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
    }

    private isNonRetryableError(error: Error): boolean {
        const message = error.message.toLowerCase();
        return (
            message.includes('invalid_api_key') ||
            message.includes('incorrect api key') ||
            message.includes('unauthorized') ||
            message.includes('forbidden') ||
            message.includes('invalid request') ||
            message.includes('content_filter') ||
            message.includes('context_length_exceeded') ||
            message.includes('model_not_found')
        );
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Method to set custom rate limiting
    protected setMinRequestInterval(intervalMs: number): void {
        this.minRequestInterval = intervalMs;
    }
}

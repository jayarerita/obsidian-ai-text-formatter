import { AIResponse } from '../types';

export abstract class BaseAIService {
    protected apiKey: string;
    protected maxTokens: number;

    constructor(apiKey: string, maxTokens: number = 4000) {
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
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            throw new Error(`Network request failed: ${error.message}`);
        }
    }
}

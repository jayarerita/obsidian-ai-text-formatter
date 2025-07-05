import { BaseAIService } from './base-service';
import { AIResponse } from '../types';

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIRequest {
    model: string;
    messages: OpenAIMessage[];
    max_tokens: number;
    temperature: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        total_tokens: number;
        prompt_tokens: number;
        completion_tokens: number;
    };
}

interface OpenAIError {
    error: {
        message: string;
        type: string;
        code?: string;
    };
}

export class OpenAIService extends BaseAIService {
    private readonly baseUrl = 'https://api.openai.com/v1';
    private modelName = 'gpt-3.5-turbo';

    constructor(apiKey: string, maxTokens: number = 1000) {
        super(apiKey, maxTokens);
    }

    async generateText(prompt: string): Promise<AIResponse> {
        if (!this.validateApiKey()) {
            return this.createErrorResponse('Invalid OpenAI API key');
        }

        try {
            console.log(`OpenAI: Using model ${this.modelName} with prompt length: ${prompt.length}`);

            const requestBody: OpenAIRequest = {
                model: this.modelName,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: 0.7,
                top_p: 0.9,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            };

            const response = await this.makeHttpRequest(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData: OpenAIError = await response.json();
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data: OpenAIResponse = await response.json();

            if (data.choices && data.choices.length > 0) {
                const content = data.choices[0].message.content.trim();
                const tokensUsed = data.usage?.total_tokens;
                
                console.log(`OpenAI: Successfully generated ${content.length} characters, used ${tokensUsed || 'unknown'} tokens`);
                return this.createSuccessResponse(content, tokensUsed);
            } else {
                return this.createErrorResponse('No response generated from OpenAI');
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            
            // Handle specific OpenAI API errors
            if (error.message?.includes('invalid_api_key') || error.message?.includes('Incorrect API key')) {
                return this.createErrorResponse('Invalid OpenAI API key. Please check your API key in settings.');
            } else if (error.message?.includes('insufficient_quota') || error.message?.includes('quota')) {
                return this.createErrorResponse('OpenAI API quota exceeded. Please check your usage limits or add billing information.');
            } else if (error.message?.includes('rate_limit_exceeded') || error.message?.includes('rate limit')) {
                return this.createErrorResponse('OpenAI API rate limit exceeded. Please try again later or upgrade your plan.');
            } else if (error.message?.includes('model_not_found') || error.message?.includes('does not exist')) {
                return this.createErrorResponse(`OpenAI model '${this.modelName}' not found. Please try a different model.`);
            } else if (error.message?.includes('context_length_exceeded') || error.message?.includes('maximum context length')) {
                return this.createErrorResponse('Text is too long for OpenAI API. Please select a shorter text or increase max tokens.');
            } else if (error.message?.includes('content_filter') || error.message?.includes('safety')) {
                return this.createErrorResponse('Content was blocked by OpenAI safety filters. Please try different text.');
            } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                return this.createErrorResponse('Unauthorized access to OpenAI API. Please check your API key.');
            } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
                return this.createErrorResponse('Access denied to OpenAI API. Please check your API key permissions.');
            } else if (error.message?.includes('429')) {
                return this.createErrorResponse('Too many requests to OpenAI API. Please wait and try again.');
            } else if (error.message?.includes('500') || error.message?.includes('502') || error.message?.includes('503')) {
                return this.createErrorResponse('OpenAI API is temporarily unavailable. Please try again later.');
            } else {
                return this.createErrorResponse(`OpenAI API error: ${error.message || 'Unknown error'}`);
            }
        }
    }

    validateApiKey(): boolean {
        return !!(this.apiKey && this.apiKey.startsWith('sk-') && this.apiKey.length > 20);
    }

    getMaxTokens(): number {
        return this.maxTokens;
    }

    getServiceName(): string {
        return 'OpenAI';
    }

    // Method to update API key
    updateApiKey(newApiKey: string): void {
        this.apiKey = newApiKey;
    }

    // Method to update max tokens
    updateMaxTokens(newMaxTokens: number): void {
        this.maxTokens = newMaxTokens;
    }

    // Method to test the connection
    async testConnection(): Promise<boolean> {
        if (!this.validateApiKey()) {
            return false;
        }

        try {
            const testResponse = await this.generateText('Hello, this is a test message.');
            return testResponse.success;
        } catch (error) {
            console.error('OpenAI connection test failed:', error);
            return false;
        }
    }

    // Method to get available models
    getAvailableModels(): string[] {
        return [
            'gpt-3.5-turbo',
            'gpt-3.5-turbo-16k',
            'gpt-4',
            'gpt-4-turbo-preview',
            'gpt-4o',
            'gpt-4o-mini'
        ];
    }

    // Method to switch model
    switchModel(modelName: string): void {
        if (this.getAvailableModels().includes(modelName)) {
            this.modelName = modelName;
        } else {
            throw new Error(`Unsupported OpenAI model: ${modelName}. Available models: ${this.getAvailableModels().join(', ')}`);
        }
    }

    // Method to get current model
    getCurrentModel(): string {
        return this.modelName;
    }

    // Method to get model info
    getModelInfo(): { name: string; contextLength: number; costPer1kTokens: number } {
        const modelInfo: Record<string, { contextLength: number; costPer1kTokens: number }> = {
            'gpt-3.5-turbo': { contextLength: 4096, costPer1kTokens: 0.002 },
            'gpt-3.5-turbo-16k': { contextLength: 16384, costPer1kTokens: 0.004 },
            'gpt-4': { contextLength: 8192, costPer1kTokens: 0.03 },
            'gpt-4-turbo-preview': { contextLength: 128000, costPer1kTokens: 0.01 },
            'gpt-4o': { contextLength: 128000, costPer1kTokens: 0.005 },
            'gpt-4o-mini': { contextLength: 128000, costPer1kTokens: 0.00015 }
        };

        return {
            name: this.modelName,
            ...modelInfo[this.modelName] || { contextLength: 4096, costPer1kTokens: 0.002 }
        };
    }
}

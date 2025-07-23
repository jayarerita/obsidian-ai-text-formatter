import OpenAI from 'openai';

import { BaseAIService } from './base-service';
import { AIResponse } from '../types';


export class OpenAIService extends BaseAIService {
    private modelName = 'gpt-3.5-turbo';

    constructor(apiKey: string, maxTokens = 1000) {
        super(apiKey, maxTokens);
        
        // Set conservative rate limiting for OpenAI
        // Free tier: 3 requests per minute, Paid tier: 3500 requests per minute
        // We'll use 2 seconds between requests to be safe for free tier users
        this.setMinRequestInterval(2000);
    }

    async generateText(prompt: string): Promise<AIResponse> {
        if (!this.validateApiKey()) {
            return this.createErrorResponse('Invalid OpenAI API key. Please check your API key in settings.');
        }

        const client = new OpenAI({
            apiKey: this.apiKey,
            dangerouslyAllowBrowser: true // Needed to run in "browserlike env"
          });

        try {
            console.log(`OpenAI: Using model ${this.modelName} with prompt length: ${prompt.length}`);

            const response = await client.chat.completions.create({
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
            });

            if (response.choices && response.choices.length > 0) {
                const content = response.choices[0].message.content?.trim() || '';
                const tokensUsed = response.usage?.total_tokens;
                
                console.log(`OpenAI: Successfully generated ${content.length} characters, used ${tokensUsed || 'unknown'} tokens`);
                return this.createSuccessResponse(content, tokensUsed);
            } else {
                return this.createErrorResponse('No response generated from OpenAI. Please try again.');
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.handleOpenAIError(error);
        }
    }

    private handleOpenAIError(error: unknown): AIResponse {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Handle specific OpenAI API errors with user-friendly messages
        if (errorMessage.includes('invalid_api_key') || errorMessage.includes('Incorrect API key')) {
            return this.createErrorResponse('❌ Invalid OpenAI API key. Please check your API key in plugin settings.');
        } 
        
        if (errorMessage.includes('insufficient_quota') || errorMessage.includes('quota')) {
            return this.createErrorResponse('💳 OpenAI API quota exceeded. Please check your usage limits or add billing information to your OpenAI account.');
        } 
        
        if (errorMessage.includes('Rate limit exceeded') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
            return this.createErrorResponse('⏱️ OpenAI API rate limit exceeded. The plugin will automatically retry. If this persists, please wait a few minutes or upgrade your OpenAI plan.');
        } 
        
        if (errorMessage.includes('model_not_found') || errorMessage.includes('does not exist')) {
            return this.createErrorResponse(`🤖 OpenAI model '${this.modelName}' not found. Please select a different model in settings.`);
        } 
        
        if (errorMessage.includes('context_length_exceeded') || errorMessage.includes('maximum context length')) {
            return this.createErrorResponse('📏 Selected text is too long for the current OpenAI model. Please select shorter text or switch to a model with larger context window (like GPT-4 Turbo).');
        } 
        
        if (errorMessage.includes('content_filter') || errorMessage.includes('safety')) {
            return this.createErrorResponse('🛡️ Content was blocked by OpenAI safety filters. Please try with different text.');
        } 
        
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            return this.createErrorResponse('🔐 Unauthorized access to OpenAI API. Please verify your API key is correct and active.');
        } 
        
        if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
            return this.createErrorResponse('🚫 Access denied to OpenAI API. Your API key may not have the required permissions.');
        } 
        
        if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
            return this.createErrorResponse('🔧 OpenAI API is temporarily unavailable. Please try again in a few minutes.');
        }
        
        if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
            return this.createErrorResponse('⏰ Request timed out. Please try again with shorter text or check your internet connection.');
        }
        
        if (errorMessage.includes('Network request failed')) {
            return this.createErrorResponse('🌐 Network error occurred. Please check your internet connection and try again.');
        }
        
        // Generic error with helpful context
        return this.createErrorResponse(`❗ OpenAI API error: ${errorMessage}. Please try again or check your API key and settings.`);
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

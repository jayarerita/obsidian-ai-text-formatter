import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';
import { BaseAIService } from './base-service';
import { AIResponse } from '../types';

export class GeminiService extends BaseAIService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: GenerativeModel | null = null;
    private modelName = 'gemini-2.0-flash-lite';

    constructor(apiKey: string, maxTokens: number = 1000) {
        super(apiKey, maxTokens);
        this.initializeService();
    }

    private initializeService(): void {
        if (this.validateApiKey()) {
            try {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
                
                const generationConfig: GenerationConfig = {
                    maxOutputTokens: this.maxTokens,
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                };

                this.model = this.genAI.getGenerativeModel({ 
                    model: this.modelName,
                    generationConfig
                });
            } catch (error) {
                console.error('Failed to initialize Gemini service:', error);
                this.genAI = null;
                this.model = null;
            }
        }
    }

    async generateText(prompt: string): Promise<AIResponse> {
        if (!this.validateApiKey()) {
            return this.createErrorResponse('Invalid Gemini API key');
        }

        if (!this.model) {
            this.initializeService();
            if (!this.model) {
                return this.createErrorResponse('Failed to initialize Gemini model');
            }
        }

        try {
            console.log(`Gemini: Using model ${this.modelName} with prompt length: ${prompt.length}`);
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            
            if (!response) {
                return this.createErrorResponse('No response received from Gemini');
            }

            const text = response.text();
            
            if (!text || text.trim().length === 0) {
                return this.createErrorResponse('Empty response from Gemini');
            }

            // Get usage metadata if available
            const usageMetadata = response.usageMetadata;
            const tokensUsed = usageMetadata?.totalTokenCount;

            console.log(`Gemini: Successfully generated ${text.length} characters, used ${tokensUsed || 'unknown'} tokens`);
            console.log(`Gemini: Response: ${text.trim()}`);
            return this.createSuccessResponse(text.trim(), tokensUsed);

        } catch (error) {
            console.error('Gemini API Error:', error);
            
            // Handle specific Gemini API errors
            if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('Invalid API key')) {
                return this.createErrorResponse('Invalid Gemini API key. Please check your API key in settings.');
            } else if (error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('quota')) {
                return this.createErrorResponse('Gemini API quota exceeded. Please check your usage limits.');
            } else if (error.message?.includes('RATE_LIMIT_EXCEEDED') || error.message?.includes('rate limit')) {
                return this.createErrorResponse('Gemini API rate limit exceeded. Please try again later.');
            } else if (error.message?.includes('SAFETY') || error.message?.includes('safety')) {
                return this.createErrorResponse('Content was blocked by Gemini safety filters. Please try different text.');
            } else if (error.message?.includes('RECITATION') || error.message?.includes('recitation')) {
                return this.createErrorResponse('Content may contain copyrighted material. Please try different text.');
            } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
                return this.createErrorResponse(`Gemini model '${this.modelName}' not found. Try switching to 'gemini-1.5-pro' or 'gemini-1.0-pro' in settings.`);
            } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
                return this.createErrorResponse('Access denied to Gemini API. Please check your API key permissions.');
            } else {
                return this.createErrorResponse(`Gemini API error: ${error.message || 'Unknown error'}`);
            }
        }
    }

    validateApiKey(): boolean {
        return !!(this.apiKey && this.apiKey.length > 10 && this.apiKey.startsWith('AIza'));
    }

    getMaxTokens(): number {
        return this.maxTokens;
    }

    getServiceName(): string {
        return 'Google Gemini';
    }

    // Method to update API key and reinitialize service
    updateApiKey(newApiKey: string): void {
        this.apiKey = newApiKey;
        this.initializeService();
    }

    // Method to update max tokens and reinitialize service
    updateMaxTokens(newMaxTokens: number): void {
        this.maxTokens = newMaxTokens;
        this.initializeService();
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
            console.error('Gemini connection test failed:', error);
            return false;
        }
    }

    // Method to get available models (for future extensibility)
    getAvailableModels(): string[] {
        return [
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite-preview-06-17',
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-1.0-pro'
        ];
    }

    // Method to switch model
    switchModel(modelName: string): void {
        if (this.getAvailableModels().includes(modelName)) {
            this.modelName = modelName;
            this.initializeService();
        } else {
            throw new Error(`Unsupported model: ${modelName}. Available models: ${this.getAvailableModels().join(', ')}`);
        }
    }
}

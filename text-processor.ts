import { BaseAIService } from './ai-services/base-service';
import { AIServiceFactory } from './ai-services/service-factory';
import { PromptBuilder } from './utils/prompts';
import { FormatType, AIService, AIResponse, ProcessingResult } from './types';
import { SettingsManager } from './settings';

export class TextProcessor {
    private settingsManager: SettingsManager;

    constructor(settingsManager: SettingsManager) {
        this.settingsManager = settingsManager;
    }

    async reformatText(
        text: string, 
        format: FormatType, 
        customPrompt?: string
    ): Promise<ProcessingResult> {
        // Validate input
        if (!text || text.trim().length === 0) {
            throw new Error('No text provided for reformatting');
        }

        if (!this.settingsManager.isConfigured()) {
            throw new Error('AI service not configured. Please set up your API key in settings.');
        }

        // Get AI service
        const aiService = this.selectAIService();
        
        // Build prompt
        const prompt = this.buildPrompt(text, format, customPrompt);
        
        // Process text
        const response = await aiService.generateText(prompt);
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to process text');
        }

        return {
            originalText: text,
            formattedText: response.content || '',
            format,
            timestamp: new Date()
        };
    }

    private selectAIService(): BaseAIService {
        const settings = this.settingsManager.getSettings();
        const apiKey = this.settingsManager.getApiKey(settings.selectedService);
        const selectedModel = this.settingsManager.getSelectedModel(settings.selectedService);
        
        if (!apiKey) {
            throw new Error(`No API key configured for ${settings.selectedService}`);
        }

        return AIServiceFactory.createService(
            settings.selectedService,
            apiKey,
            settings.maxTokens,
            selectedModel
        );
    }

    private buildPrompt(text: string, format: FormatType, customPrompt?: string): string {
        // Use custom prompt if provided and valid
        if (customPrompt && PromptBuilder.validatePrompt(customPrompt)) {
            return PromptBuilder.buildPrompt(text, format, customPrompt);
        }

        // Try to use saved custom prompt
        const savedCustomPrompt = this.settingsManager.getCustomPrompt(format);
        if (savedCustomPrompt && PromptBuilder.validatePrompt(savedCustomPrompt)) {
            return PromptBuilder.buildPrompt(text, format, savedCustomPrompt);
        }

        // Fall back to default prompt
        return PromptBuilder.buildPrompt(text, format);
    }

    validateTextLength(text: string): boolean {
        const settings = this.settingsManager.getSettings();
        // Rough estimate: 1 token ≈ 4 characters
        const estimatedTokens = text.length / 4;
        return estimatedTokens <= (settings.maxTokens * 0.8); // Leave room for prompt and response
    }

    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const aiService = this.selectAIService();
            const testPrompt = 'Please respond with "Connection successful" to test the API connection.';
            const response = await aiService.generateText(testPrompt);
            
            if (response.success) {
                return {
                    success: true,
                    message: `Successfully connected to ${aiService.getServiceName()}`
                };
            } else {
                return {
                    success: false,
                    message: response.error || 'Connection test failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Connection test failed: ${error.message}`
            };
        }
    }
}

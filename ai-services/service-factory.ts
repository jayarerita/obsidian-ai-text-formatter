import { BaseAIService } from './base-service';
import { OpenAIService } from './openai-service';
import { GeminiService } from './gemini-service';
import { ClaudeService } from './claude-service';
import { AIService } from '../types';

export class AIServiceFactory {
    static createService(
        serviceType: AIService, 
        apiKey: string, 
        maxTokens: number = 4000,
        model?: string
    ): BaseAIService {
        switch (serviceType) {
            case AIService.OPENAI:
                const openaiService = new OpenAIService(apiKey, maxTokens);
                if (model) openaiService.switchModel(model);
                return openaiService;
            case AIService.GEMINI:
                const geminiService = new GeminiService(apiKey, maxTokens);
                if (model) geminiService.switchModel(model);
                return geminiService;
            case AIService.CLAUDE:
                const claudeService = new ClaudeService(apiKey, maxTokens);
                if (model) claudeService.switchModel(model);
                return claudeService;
            default:
                throw new Error(`Unsupported AI service: ${serviceType}`);
        }
    }

    static validateApiKey(serviceType: AIService, apiKey: string): boolean {
        if (!apiKey || apiKey.trim().length === 0) {
            return false;
        }

        switch (serviceType) {
            case AIService.OPENAI:
                return apiKey.startsWith('sk-');
            case AIService.GEMINI:
                return apiKey.length > 10 && apiKey.startsWith('AIza');
            case AIService.CLAUDE:
                return apiKey.startsWith('sk-ant-');
            default:
                return false;
        }
    }
}

import { SettingsManager } from '../settings';
import { TextProcessor } from '../text-processor';
import { AIServiceFactory } from '../ai-services/service-factory';
import { FormatType, AIService } from '../types';
import { ErrorHandler } from '../utils/error-handler';

// Mock plugin for testing
class MockPlugin {
    private data: any = {};
    
    async loadData() {
        return this.data;
    }
    
    async saveData(data: any) {
        this.data = data;
    }
}

describe('Integration Tests', () => {
    let mockPlugin: MockPlugin;
    let settingsManager: SettingsManager;
    let textProcessor: TextProcessor;

    beforeEach(() => {
        mockPlugin = new MockPlugin();
        settingsManager = new SettingsManager(mockPlugin as any);
        textProcessor = new TextProcessor(settingsManager);
    });

    describe('Settings Management', () => {
        test('should load and save settings correctly', async () => {
            await settingsManager.loadSettings();
            
            // Update settings
            settingsManager.updateSettings({
                selectedService: AIService.OPENAI,
                maxTokens: 2000
            });
            
            settingsManager.setApiKey('openai', 'sk-test-key');
            settingsManager.setCustomPrompt('notes', 'Custom notes prompt with {text}');
            
            await settingsManager.saveSettings();
            
            // Create new instance and load
            const newSettingsManager = new SettingsManager(mockPlugin as any);
            await newSettingsManager.loadSettings();
            
            expect(newSettingsManager.getSettings().selectedService).toBe(AIService.OPENAI);
            expect(newSettingsManager.getSettings().maxTokens).toBe(2000);
            expect(newSettingsManager.getApiKey('openai')).toBe('sk-test-key');
            expect(newSettingsManager.getCustomPrompt('notes')).toBe('Custom notes prompt with {text}');
        });

        test('should validate configuration correctly', async () => {
            await settingsManager.loadSettings();
            
            // Initially not configured
            expect(settingsManager.isConfigured()).toBe(false);
            
            // Configure with API key
            settingsManager.setApiKey('openai', 'sk-test-key');
            expect(settingsManager.isConfigured()).toBe(true);
        });
    });

    describe('AI Service Factory', () => {
        test('should create correct service instances', () => {
            const openaiService = AIServiceFactory.createService(AIService.OPENAI, 'sk-test', 1000);
            expect(openaiService.getServiceName()).toBe('OpenAI');
            expect(openaiService.getMaxTokens()).toBe(1000);

            const geminiService = AIServiceFactory.createService(AIService.GEMINI, 'test-key', 2000);
            expect(geminiService.getServiceName()).toBe('Google Gemini');
            expect(geminiService.getMaxTokens()).toBe(2000);

            const claudeService = AIServiceFactory.createService(AIService.CLAUDE, 'sk-ant-test', 3000);
            expect(claudeService.getServiceName()).toBe('Anthropic Claude');
            expect(claudeService.getMaxTokens()).toBe(3000);
        });

        test('should validate API keys correctly', () => {
            expect(AIServiceFactory.validateApiKey(AIService.OPENAI, 'sk-test123')).toBe(true);
            expect(AIServiceFactory.validateApiKey(AIService.OPENAI, 'invalid-key')).toBe(false);
            
            expect(AIServiceFactory.validateApiKey(AIService.CLAUDE, 'sk-ant-test123')).toBe(true);
            expect(AIServiceFactory.validateApiKey(AIService.CLAUDE, 'sk-test123')).toBe(false);
            
            expect(AIServiceFactory.validateApiKey(AIService.GEMINI, 'valid-gemini-key')).toBe(true);
            expect(AIServiceFactory.validateApiKey(AIService.GEMINI, 'short')).toBe(false);
        });

        test('should throw error for unsupported service', () => {
            expect(() => {
                AIServiceFactory.createService('unsupported' as AIService, 'key', 1000);
            }).toThrow('Unsupported AI service');
        });
    });

    describe('Text Processing Workflow', () => {
        test('should fail when not configured', async () => {
            await settingsManager.loadSettings();
            
            await expect(
                textProcessor.reformatText('test text', FormatType.NOTES)
            ).rejects.toThrow('AI service not configured');
        });

        test('should validate text length', async () => {
            await settingsManager.loadSettings();
            settingsManager.setApiKey('openai', 'sk-test-key');
            
            const longText = 'a'.repeat(50000);
            expect(textProcessor.validateTextLength(longText)).toBe(false);
            
            const shortText = 'This is a reasonable length text';
            expect(textProcessor.validateTextLength(shortText)).toBe(true);
        });

        test('should handle empty text input', async () => {
            await settingsManager.loadSettings();
            settingsManager.setApiKey('openai', 'sk-test-key');
            
            await expect(
                textProcessor.reformatText('', FormatType.NOTES)
            ).rejects.toThrow('No text provided');
            
            await expect(
                textProcessor.reformatText('   ', FormatType.NOTES)
            ).rejects.toThrow('No text provided');
        });
    });

    describe('Error Handling', () => {
        test('should categorize errors correctly', () => {
            const configError = ErrorHandler.handleError('API key not configured');
            expect(configError.type).toBe('configuration');
            expect(configError.recoverable).toBe(true);

            const networkError = ErrorHandler.handleError('Network request failed');
            expect(networkError.type).toBe('network');
            expect(networkError.recoverable).toBe(true);

            const apiError = ErrorHandler.handleError('OpenAI API error: Invalid request');
            expect(apiError.type).toBe('api');
            expect(apiError.recoverable).toBe(true);

            const validationError = ErrorHandler.handleError('No text provided for reformatting');
            expect(validationError.type).toBe('validation');
            expect(validationError.recoverable).toBe(true);
        });

        test('should validate API keys correctly', () => {
            const validOpenAI = ErrorHandler.validateApiKey('openai', 'sk-test123');
            expect(validOpenAI.valid).toBe(true);

            const invalidOpenAI = ErrorHandler.validateApiKey('openai', 'invalid');
            expect(invalidOpenAI.valid).toBe(false);
            expect(invalidOpenAI.message).toContain('should start with "sk-"');

            const validClaude = ErrorHandler.validateApiKey('claude', 'sk-ant-test123');
            expect(validClaude.valid).toBe(true);

            const invalidClaude = ErrorHandler.validateApiKey('claude', 'sk-test123');
            expect(invalidClaude.valid).toBe(false);
            expect(invalidClaude.message).toContain('should start with "sk-ant-"');
        });

        test('should validate text input correctly', () => {
            const validText = ErrorHandler.validateTextInput('This is valid text');
            expect(validText.valid).toBe(true);

            const emptyText = ErrorHandler.validateTextInput('');
            expect(emptyText.valid).toBe(false);
            expect(emptyText.message).toContain('select some text');

            const longText = ErrorHandler.validateTextInput('a'.repeat(15000), 10000);
            expect(longText.valid).toBe(false);
            expect(longText.message).toContain('too long');
        });

        test('should identify retryable errors', () => {
            expect(ErrorHandler.isRetryableError(new Error('Network timeout'))).toBe(true);
            expect(ErrorHandler.isRetryableError(new Error('Rate limit exceeded'))).toBe(true);
            expect(ErrorHandler.isRetryableError(new Error('Server error 503'))).toBe(true);
            
            expect(ErrorHandler.isRetryableError(new Error('Invalid API key'))).toBe(false);
            expect(ErrorHandler.isRetryableError(new Error('Validation failed'))).toBe(false);
        });

        test('should provide appropriate error guidance', () => {
            const configError = ErrorHandler.handleConfigurationError('API key missing');
            const guidance = ErrorHandler.getErrorGuidance(configError);
            expect(guidance).toContain('Settings');
            expect(guidance).toContain('configure');

            const networkError = ErrorHandler.handleNetworkError('Connection failed');
            const networkGuidance = ErrorHandler.getErrorGuidance(networkError);
            expect(networkGuidance).toContain('internet connection');
        });
    });

    describe('Format-specific Processing', () => {
        test('should use correct prompts for each format', () => {
            // This would require mocking the AI service responses
            // For now, we test that the correct prompts are built
            const testText = 'Sample text for testing';
            
            // Test that different formats generate different prompts
            const notesPrompt = textProcessor['buildPrompt'](testText, FormatType.NOTES);
            const prosePrompt = textProcessor['buildPrompt'](testText, FormatType.PROSE);
            const todoPrompt = textProcessor['buildPrompt'](testText, FormatType.TODO);
            
            expect(notesPrompt).toContain(testText);
            expect(prosePrompt).toContain(testText);
            expect(todoPrompt).toContain(testText);
            
            // Each should have different formatting instructions
            expect(notesPrompt).not.toBe(prosePrompt);
            expect(prosePrompt).not.toBe(todoPrompt);
            expect(notesPrompt).not.toBe(todoPrompt);
        });
    });
});

// Test utilities
export class TestUtils {
    static createMockEditor(selectedText: string = '') {
        return {
            getSelection: () => selectedText,
            getCursor: (type: string) => ({ line: 0, ch: 0 }),
            replaceRange: jest.fn(),
            replaceSelection: jest.fn(),
            setCursor: jest.fn(),
            operation: (fn: () => void) => fn()
        };
    }

    static createMockApp() {
        return {
            workspace: {
                on: jest.fn()
            }
        };
    }

    static async waitFor(condition: () => boolean, timeout: number = 5000): Promise<void> {
        const start = Date.now();
        while (!condition() && Date.now() - start < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!condition()) {
            throw new Error('Condition not met within timeout');
        }
    }
}

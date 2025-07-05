import { AIServiceFactory } from '../ai-services/service-factory';
import { AIService } from '../types';

describe('AIServiceFactory', () => {
  describe('API Key Validation', () => {
    test('should validate OpenAI API keys', () => {
      expect(AIServiceFactory.validateApiKey(AIService.OPENAI, 'sk-test123')).toBe(true);
      expect(AIServiceFactory.validateApiKey(AIService.OPENAI, 'invalid-key')).toBe(false);
      expect(AIServiceFactory.validateApiKey(AIService.OPENAI, '')).toBe(false);
    });

    test('should validate Claude API keys', () => {
      expect(AIServiceFactory.validateApiKey(AIService.CLAUDE, 'sk-ant-test123')).toBe(true);
      expect(AIServiceFactory.validateApiKey(AIService.CLAUDE, 'sk-test123')).toBe(false);
      expect(AIServiceFactory.validateApiKey(AIService.CLAUDE, '')).toBe(false);
    });

    test('should validate Gemini API keys', () => {
      expect(AIServiceFactory.validateApiKey(AIService.GEMINI, 'AIzaSyTest123456789')).toBe(true);
      expect(AIServiceFactory.validateApiKey(AIService.GEMINI, 'short')).toBe(false);
      expect(AIServiceFactory.validateApiKey(AIService.GEMINI, '')).toBe(false);
    });

    test('should handle unknown service types', () => {
      expect(AIServiceFactory.validateApiKey('unknown' as AIService, 'any-key')).toBe(false);
    });
  });

  describe('Service Creation', () => {
    test('should throw error for unsupported service', () => {
      expect(() => {
        AIServiceFactory.createService('unsupported' as AIService, 'key', 1000);
      }).toThrow('Unsupported AI service');
    });

    test('should create services with valid parameters', () => {
      // These tests would require mocking the actual service classes
      // For now, we just test that the factory doesn't throw for valid inputs
      expect(() => {
        AIServiceFactory.createService(AIService.OPENAI, 'sk-test', 1000);
      }).not.toThrow();

      expect(() => {
        AIServiceFactory.createService(AIService.GEMINI, 'AIzaSyTest123456789', 1000);
      }).not.toThrow();

      expect(() => {
        AIServiceFactory.createService(AIService.CLAUDE, 'sk-ant-test', 1000);
      }).not.toThrow();
    });
  });
});

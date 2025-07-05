import { FormatType, AIService, DEFAULT_SETTINGS } from '../types';
import { PromptBuilder } from '../utils/prompts';

describe('Basic Plugin Tests', () => {
  describe('Types and Constants', () => {
    test('should have correct format types', () => {
      expect(FormatType.NOTES).toBe('notes');
      expect(FormatType.PROSE).toBe('prose');
      expect(FormatType.TODO).toBe('todo');
    });

    test('should have correct AI service types', () => {
      expect(AIService.OPENAI).toBe('openai');
      expect(AIService.GEMINI).toBe('gemini');
      expect(AIService.CLAUDE).toBe('claude');
    });

    test('should have default settings', () => {
      expect(DEFAULT_SETTINGS).toBeDefined();
      expect(DEFAULT_SETTINGS.selectedService).toBe(AIService.OPENAI);
      expect(DEFAULT_SETTINGS.maxTokens).toBe(4000);
      expect(DEFAULT_SETTINGS.apiKeys).toBeDefined();
      expect(DEFAULT_SETTINGS.selectedModels).toBeDefined();
      expect(DEFAULT_SETTINGS.customPrompts).toBeDefined();
    });
  });

  describe('Prompt Builder', () => {
    test('should build prompts for different formats', () => {
      const testText = 'This is test text';
      
      const notesPrompt = PromptBuilder.buildPrompt(testText, FormatType.NOTES);
      expect(notesPrompt).toContain(testText);
      expect(typeof notesPrompt).toBe('string');
      expect(notesPrompt.length).toBeGreaterThan(0);

      const prosePrompt = PromptBuilder.buildPrompt(testText, FormatType.PROSE);
      expect(prosePrompt).toContain(testText);
      expect(typeof prosePrompt).toBe('string');
      expect(prosePrompt.length).toBeGreaterThan(0);

      const todoPrompt = PromptBuilder.buildPrompt(testText, FormatType.TODO);
      expect(todoPrompt).toContain(testText);
      expect(typeof todoPrompt).toBe('string');
      expect(todoPrompt.length).toBeGreaterThan(0);
    });

    test('should validate prompts', () => {
      expect(PromptBuilder.validatePrompt('Valid prompt with {text}')).toBe(true);
      expect(PromptBuilder.validatePrompt('Invalid prompt without placeholder')).toBe(false);
      expect(PromptBuilder.validatePrompt('')).toBe(false);
    });

    test('should return default prompts', () => {
      const defaultPrompts = PromptBuilder.getAllDefaultPrompts();
      expect(defaultPrompts).toBeDefined();
      expect(defaultPrompts[FormatType.NOTES]).toBeDefined();
      expect(defaultPrompts[FormatType.PROSE]).toBeDefined();
      expect(defaultPrompts[FormatType.TODO]).toBeDefined();
    });
  });
});

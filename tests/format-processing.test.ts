import { PromptBuilder } from '../utils/prompts';
import { FormatType } from '../types';

describe('Format Processing Tests', () => {
    describe('PromptBuilder', () => {
        const sampleText = 'This is a sample text for testing the prompt builder functionality.';

        test('should build prompt for notes format', () => {
            const prompt = PromptBuilder.buildPrompt(sampleText, FormatType.NOTES);
            expect(prompt).toContain(sampleText);
            expect(prompt).toContain('notes');
            expect(prompt).toContain('headers');
            expect(prompt).toContain('bullet points');
        });

        test('should build prompt for prose format', () => {
            const prompt = PromptBuilder.buildPrompt(sampleText, FormatType.PROSE);
            expect(prompt).toContain(sampleText);
            expect(prompt).toContain('prose');
            expect(prompt).toContain('paragraph');
            expect(prompt).toContain('grammar');
        });

        test('should build prompt for todo format', () => {
            const prompt = PromptBuilder.buildPrompt(sampleText, FormatType.TODO);
            expect(prompt).toContain(sampleText);
            expect(prompt).toContain('to-do');
            expect(prompt).toContain('checkbox');
            expect(prompt).toContain('actionable');
        });

        test('should use custom prompt when provided', () => {
            const customPrompt = 'Custom prompt with {text} placeholder';
            const prompt = PromptBuilder.buildPrompt(sampleText, FormatType.NOTES, customPrompt);
            expect(prompt).toBe(`Custom prompt with ${sampleText} placeholder`);
        });

        test('should validate prompt correctly', () => {
            expect(PromptBuilder.validatePrompt('Valid prompt with {text}')).toBe(true);
            expect(PromptBuilder.validatePrompt('Invalid prompt without placeholder')).toBe(false);
            expect(PromptBuilder.validatePrompt('')).toBe(false);
            expect(PromptBuilder.validatePrompt('   ')).toBe(false);
        });

        test('should return default prompts', () => {
            const defaultPrompts = PromptBuilder.getAllDefaultPrompts();
            expect(defaultPrompts[FormatType.NOTES]).toBeDefined();
            expect(defaultPrompts[FormatType.PROSE]).toBeDefined();
            expect(defaultPrompts[FormatType.TODO]).toBeDefined();
        });
    });

    describe('Format-specific expectations', () => {
        test('notes format should emphasize structure', () => {
            const notesPrompt = PromptBuilder.getDefaultPrompt(FormatType.NOTES);
            expect(notesPrompt.toLowerCase()).toContain('header');
            expect(notesPrompt.toLowerCase()).toContain('bullet');
            expect(notesPrompt.toLowerCase()).toContain('markdown');
        });

        test('prose format should emphasize readability', () => {
            const prosePrompt = PromptBuilder.getDefaultPrompt(FormatType.PROSE);
            expect(prosePrompt.toLowerCase()).toContain('prose');
            expect(prosePrompt.toLowerCase()).toContain('paragraph');
            expect(prosePrompt.toLowerCase()).toContain('flow');
        });

        test('todo format should emphasize actionability', () => {
            const todoPrompt = PromptBuilder.getDefaultPrompt(FormatType.TODO);
            expect(todoPrompt.toLowerCase()).toContain('to-do');
            expect(todoPrompt.toLowerCase()).toContain('checkbox');
            expect(todoPrompt.toLowerCase()).toContain('actionable');
        });
    });
});

// Mock test data for different format types
export const TEST_DATA = {
    voice_transcription: `
        So I was thinking about the project and we need to do several things first we need to 
        set up the database then we need to create the user interface and also we should 
        probably test everything before we deploy it to production oh and don't forget to 
        update the documentation
    `,
    
    expected_notes: `
        # Project Tasks
        
        ## Database Setup
        - Set up the database
        
        ## User Interface
        - Create the user interface
        
        ## Testing & Deployment
        - Test everything before production deployment
        - Update documentation
    `,
    
    expected_prose: `
        I was considering the project requirements and identified several key tasks that need 
        to be completed. First, we need to set up the database infrastructure. Following that, 
        we should focus on creating the user interface. It's also important that we thoroughly 
        test everything before deploying to production. Additionally, we shouldn't forget to 
        update the documentation to reflect any changes made during development.
    `,
    
    expected_todo: `
        - [ ] Set up the database
        - [ ] Create the user interface  
        - [ ] Test everything before production deployment
        - [ ] Update documentation
    `
};

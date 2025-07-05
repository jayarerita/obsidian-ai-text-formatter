import { FormatType } from '../types';

export const DEFAULT_PROMPTS = {
    [FormatType.NOTES]: `Please reformat the following text into well-structured notes with proper grammar, punctuation, and markdown formatting. Use headers (##, ###) for main topics, bullet points (-) for lists, and improve readability while preserving all important information:

{text}`,

    [FormatType.PROSE]: `Please reformat the following text into well-written prose with proper grammar, punctuation, and paragraph structure. Improve flow and readability while maintaining the original meaning and all key information:

{text}`,

    [FormatType.TODO]: `Please convert the following text into a well-organized to-do list using markdown checkbox syntax (- [ ]). Extract actionable items and organize them logically. Include any relevant context or details as sub-items:

{text}`
};

export class PromptBuilder {
    static buildPrompt(text: string, format: FormatType, customPrompt?: string): string {
        const template = customPrompt || DEFAULT_PROMPTS[format];
        return template.replace('{text}', text);
    }

    static validatePrompt(prompt: string): boolean {
        return !!(prompt && prompt.trim().length > 0 && prompt.includes('{text}'));
    }

    static getDefaultPrompt(format: FormatType): string {
        return DEFAULT_PROMPTS[format];
    }

    static getAllDefaultPrompts(): Record<FormatType, string> {
        return { ...DEFAULT_PROMPTS };
    }
}

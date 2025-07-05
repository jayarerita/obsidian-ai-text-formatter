import { App, Modal, Setting } from 'obsidian';
import { FormatType } from '../types';

export class FormatSelectionModal extends Modal {
    private onSelect: (format: FormatType) => void;
    private selectedText: string;

    constructor(app: App, selectedText: string, onSelect: (format: FormatType) => void) {
        super(app);
        this.selectedText = selectedText;
        this.onSelect = onSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Choose Format Type' });
        
        // Show preview of selected text
        const previewEl = contentEl.createEl('div', { cls: 'ai-formatter-preview' });
        previewEl.createEl('h4', { text: 'Selected Text:' });
        const textPreview = this.selectedText.length > 200 
            ? this.selectedText.substring(0, 200) + '...'
            : this.selectedText;
        previewEl.createEl('p', { text: textPreview, cls: 'ai-formatter-preview-text' });

        // Format options
        const optionsEl = contentEl.createEl('div', { cls: 'ai-formatter-options' });

        // Notes format option
        new Setting(optionsEl)
            .setName('📝 Notes Format')
            .setDesc('Reformat into structured notes with headers and bullet points')
            .addButton(button => {
                button
                    .setButtonText('Select')
                    .setCta()
                    .onClick(() => {
                        this.onSelect(FormatType.NOTES);
                        this.close();
                    });
            });

        // Prose format option
        new Setting(optionsEl)
            .setName('📄 Prose Format')
            .setDesc('Reformat into flowing paragraphs with proper grammar')
            .addButton(button => {
                button
                    .setButtonText('Select')
                    .setCta()
                    .onClick(() => {
                        this.onSelect(FormatType.PROSE);
                        this.close();
                    });
            });

        // Todo format option
        new Setting(optionsEl)
            .setName('✅ To-Do List')
            .setDesc('Convert into actionable checkbox items')
            .addButton(button => {
                button
                    .setButtonText('Select')
                    .setCta()
                    .onClick(() => {
                        this.onSelect(FormatType.TODO);
                        this.close();
                    });
            });

        // Cancel button
        const buttonEl = contentEl.createEl('div', { cls: 'modal-button-container' });
        buttonEl.createEl('button', { text: 'Cancel', cls: 'mod-cta' })
            .addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

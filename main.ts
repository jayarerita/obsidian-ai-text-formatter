import { Plugin, Editor } from 'obsidian';
import { SettingsManager } from './settings';
import { TextProcessor } from './text-processor';
import { AITextFormatterSettingTab } from './ui/settings-tab';
import { FormatType } from './types';
import { ErrorHandler } from './utils/error-handler';

export default class AITextFormatterPlugin extends Plugin {
    settingsManager: SettingsManager;
    textProcessor: TextProcessor;

    async onload() {
        //console.log('Loading AI Text Formatter plugin');

        // Initialize settings manager
        this.settingsManager = new SettingsManager(this);
        await this.settingsManager.loadSettings();

        // Initialize text processor
        this.textProcessor = new TextProcessor(this.settingsManager);

        // Add settings tab
        this.addSettingTab(new AITextFormatterSettingTab(this.app, this));

        // Register commands
        this.registerCommands();

        // Register context menu
        this.registerContextMenu();

        //console.log('AI Text Formatter plugin loaded successfully');
    }

    onunload() {
        //console.log('Unloading AI Text Formatter plugin');
    }

    private registerCommands(): void {
        // Command for Notes format
        this.addCommand({
            id: 'reformat-to-notes',
            name: 'Reformat selected text to Notes',
            editorCallback: async (editor) => {
                await this.reformatSelectedText(editor, FormatType.NOTES);
            }
        });

        // Command for Prose format
        this.addCommand({
            id: 'reformat-to-prose',
            name: 'Reformat selected text to Prose',
            editorCallback: async (editor) => {
                await this.reformatSelectedText(editor, FormatType.PROSE);
            }
        });

        // Command for Todo format
        this.addCommand({
            id: 'reformat-to-todo',
            name: 'Reformat selected text to To-Do List',
            editorCallback: async (editor) => {
                await this.reformatSelectedText(editor, FormatType.TODO);
            }
        });

        // Command for Custom format
        this.addCommand({
            id: 'reformat-to-custom',
            name: 'Reformat selected text to custom format',
            editorCallback: async (editor) => {
                await this.reformatSelectedText(editor, FormatType.CUSTOM);
            }
        });
    }

    private async reformatSelectedText(editor: Editor, format: FormatType): Promise<void> {
        try {
            // Get selected text and cursor position
            const selectedText = editor.getSelection();
            const selectionStart = editor.getCursor('from');
            const selectionEnd = editor.getCursor('to');
            
            // Validate selection
            const validation = ErrorHandler.validateTextInput(selectedText);
            if (!validation.valid) {
                ErrorHandler.showSimpleNotification(validation.message || "", 'warning');
                return;
            }

            // Check if service is configured
            if (!this.settingsManager.isConfigured()) {
                ErrorHandler.showSimpleNotification(
                    'Please configure your AI service API key in settings first.',
                    'warning'
                );
                return;
            }

            // Validate text length
            if (!this.textProcessor.validateTextLength(selectedText)) {
                ErrorHandler.showSimpleNotification(
                    'Selected text is too long for processing. Please select a shorter text.',
                    'warning'
                );
                return;
            }

            // Show loading notification
            ErrorHandler.showSimpleNotification(
                `Reformatting text to ${format}...`,
                'info'
            );

            try {
                // Process the text
                const result = await this.textProcessor.reformatText(selectedText, format);
                
                // Replace selected text with formatted version
                editor.replaceRange(result.formattedText, selectionStart, selectionEnd);
                
                // Position cursor at the end of the replaced text
                const lines = result.formattedText.split('\n');
                const newEndPos = {
                    line: selectionStart.line + lines.length - 1,
                    ch: lines.length === 1 
                        ? selectionStart.ch + result.formattedText.length 
                        : lines[lines.length - 1].length
                };
                
                editor.setCursor(newEndPos);
                
                // Show success notification
                ErrorHandler.showSimpleNotification(
                    `Text successfully reformatted to ${format} format`,
                    'info'
                );

            } catch (processingError) {
                const errorInfo = ErrorHandler.handleError(processingError);
                ErrorHandler.showUserNotification(errorInfo);
            }

        } catch (error) {
            const errorInfo = ErrorHandler.handleError(error);
            ErrorHandler.showUserNotification(errorInfo);
        }
    }

    private registerContextMenu(): void {
        // Register context menu for editor
        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu, editor, view) => {
                const selectedText = editor.getSelection();
                
                // Only show context menu if text is selected
                if (selectedText && selectedText.trim().length > 0) {
                    // Add separator
                    menu.addSeparator();

                    // Add individual format options
                    menu.addItem((item) => {
                        item
                            .setTitle('AI Format → Notes')
                            .setIcon('list-ordered')
                            .onClick(async () => {
                                await this.reformatSelectedText(editor, FormatType.NOTES);
                            });
                    });

                    menu.addItem((item) => {
                        item
                            .setTitle('AI Format → Prose')
                            .setIcon('align-left')
                            .onClick(async () => {
                                await this.reformatSelectedText(editor, FormatType.PROSE);
                            });
                    });

                    menu.addItem((item) => {
                        item
                            .setTitle('AI Format → To-Do List')
                            .setIcon('check-square')
                            .onClick(async () => {
                                await this.reformatSelectedText(editor, FormatType.TODO);
                            });
                    });

                    menu.addItem((item) => {
                        item
                            .setTitle('AI Format → Custom')
                            .setIcon('check-square')
                            .onClick(async () => {
                                await this.reformatSelectedText(editor, FormatType.CUSTOM);
                            });
                    });
                }
            })
        );
    }
}

import { App, PluginSettingTab, Setting } from 'obsidian';
import AITextFormatterPlugin from '../main';
import { AIService, FormatType, AVAILABLE_MODELS, MODEL_INFO } from '../types';
import { PromptBuilder } from '../utils/prompts';
import { ErrorHandler } from '../utils/error-handler';

export class AITextFormatterSettingTab extends PluginSettingTab {
    plugin: AITextFormatterPlugin;

    constructor(app: App, plugin: AITextFormatterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'AI Text Formatter Settings' });

        // AI Service Selection
        this.addServiceSelection();

        // API Keys Section
        this.addApiKeysSection();

        // Model Selection Section
        this.addModelSelectionSection();

        // Custom Prompts Section
        this.addCustomPromptsSection();

        // Advanced Settings
        this.addAdvancedSettings();
    }

    private addServiceSelection(): void {
        const { containerEl } = this;
        
        new Setting(containerEl)
            .setName('AI Service')
            .setDesc('Select which AI service to use for text reformatting')
            .addDropdown(dropdown => {
                dropdown
                    .addOption(AIService.OPENAI, 'OpenAI (GPT)')
                    .addOption(AIService.GEMINI, 'Google Gemini')
                    .addOption(AIService.CLAUDE, 'Anthropic Claude')
                    .setValue(this.plugin.settingsManager.getSettings().selectedService)
                    .onChange(async (value: AIService) => {
                        this.plugin.settingsManager.updateSettings({ selectedService: value });
                        await this.plugin.settingsManager.saveSettings();
                        this.display(); // Refresh to show relevant sections
                    });
            });
    }

    private addApiKeysSection(): void {
        const { containerEl } = this;
        const settings = this.plugin.settingsManager.getSettings();

        containerEl.createEl('h3', { text: 'API Keys' });
        containerEl.createEl('p', { 
            text: 'Enter your API keys for the AI services you want to use. Keys are stored locally and securely.',
            cls: 'setting-item-description'
        });

        // OpenAI API Key
        new Setting(containerEl)
            .setName('OpenAI API Key')
            .setDesc('Get your API key from https://platform.openai.com/api-keys')
            .addText(text => {
                text
                    .setPlaceholder('sk-...')
                    .setValue(this.plugin.settingsManager.getApiKey('openai'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setApiKey('openai', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.type = 'password';
            })
            .addButton(button => {
                button
                    .setButtonText('Test')
                    .setTooltip('Test OpenAI connection')
                    .onClick(async () => {
                        await this.testConnection(AIService.OPENAI);
                    });
            });

        // Gemini API Key
        new Setting(containerEl)
            .setName('Google Gemini API Key')
            .setDesc('Get your API key from https://makersuite.google.com/app/apikey')
            .addText(text => {
                text
                    .setPlaceholder('AIza...')
                    .setValue(this.plugin.settingsManager.getApiKey('gemini'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setApiKey('gemini', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.type = 'password';
            })
            .addButton(button => {
                button
                    .setButtonText('Test')
                    .setTooltip('Test Gemini connection')
                    .onClick(async () => {
                        await this.testConnection(AIService.GEMINI);
                    });
            });

        // Claude API Key
        new Setting(containerEl)
            .setName('Anthropic Claude API Key')
            .setDesc('Get your API key from https://console.anthropic.com/')
            .addText(text => {
                text
                    .setPlaceholder('sk-ant-...')
                    .setValue(this.plugin.settingsManager.getApiKey('claude'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setApiKey('claude', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.type = 'password';
            })
            .addButton(button => {
                button
                    .setButtonText('Test')
                    .setTooltip('Test Claude connection')
                    .onClick(async () => {
                        await this.testConnection(AIService.CLAUDE);
                    });
            });
    }

    private addModelSelectionSection(): void {
        const { containerEl } = this;

        containerEl.createEl('h3', { text: 'Model Selection' });
        containerEl.createEl('p', { 
            text: 'Choose the specific AI model to use for each service. Different models have different capabilities, speeds, and costs.',
            cls: 'setting-item-description'
        });

        // OpenAI Model Selection
        this.addModelSelection('openai', 'OpenAI Model', 'Choose the OpenAI model to use');

        // Gemini Model Selection
        this.addModelSelection('gemini', 'Gemini Model', 'Choose the Google Gemini model to use');

        // Claude Model Selection
        this.addModelSelection('claude', 'Claude Model', 'Choose the Anthropic Claude model to use');
    }

    private addModelSelection(service: string, name: string, description: string): void {
        const { containerEl } = this;
        const availableModels = AVAILABLE_MODELS[service as keyof typeof AVAILABLE_MODELS];
        const currentModel = this.plugin.settingsManager.getSelectedModel(service);

        const setting = new Setting(containerEl)
            .setName(name)
            .setDesc(description)
            .addDropdown(dropdown => {
                // Add all available models for this service
                availableModels.forEach(model => {
                    const modelInfo = MODEL_INFO[model as keyof typeof MODEL_INFO];
                    const displayName = modelInfo ? 
                        `${modelInfo.name} - ${modelInfo.description}` : 
                        model;
                    dropdown.addOption(model, displayName);
                });

                dropdown
                    .setValue(currentModel)
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setSelectedModel(service, value);
                        await this.plugin.settingsManager.saveSettings();
                        this.updateModelInfo(service, value);
                    });
            });

        // Add model info display
        this.updateModelInfo(service, currentModel, setting);
    }

    private updateModelInfo(service: string, model: string, setting?: Setting): void {
        const modelInfo = MODEL_INFO[model as keyof typeof MODEL_INFO];
        if (modelInfo && setting) {
            const infoText = `Context: ${modelInfo.contextLength.toLocaleString()} tokens | Cost: ~$${modelInfo.costPer1kTokens} per 1K tokens`;
            setting.setDesc(`Choose the ${service} model to use\n${infoText}`);
        }
    }

    private addCustomPromptsSection(): void {
        const { containerEl } = this;

        containerEl.createEl('h3', { text: 'Custom Prompts' });
        containerEl.createEl('p', { 
            text: 'Customize the prompts used for each format type. Use {text} as a placeholder for the selected text. Leave empty to use default prompts.',
            cls: 'setting-item-description'
        });

        // Notes Format Prompt
        new Setting(containerEl)
            .setName('Notes Format Prompt')
            .setDesc('Custom prompt for reformatting text into structured notes')
            .addTextArea(text => {
                text
                    .setPlaceholder(PromptBuilder.getDefaultPrompt(FormatType.NOTES))
                    .setValue(this.plugin.settingsManager.getCustomPrompt('notes'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setCustomPrompt('notes', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.rows = 4;
                text.inputEl.style.width = '100%';
            })
            .addButton(button => {
                button
                    .setButtonText('Reset')
                    .setTooltip('Reset to default prompt')
                    .onClick(async () => {
                        this.plugin.settingsManager.setCustomPrompt('notes', '');
                        await this.plugin.settingsManager.saveSettings();
                        this.display();
                    });
            });

        // Prose Format Prompt
        new Setting(containerEl)
            .setName('Prose Format Prompt')
            .setDesc('Custom prompt for reformatting text into flowing prose')
            .addTextArea(text => {
                text
                    .setPlaceholder(PromptBuilder.getDefaultPrompt(FormatType.PROSE))
                    .setValue(this.plugin.settingsManager.getCustomPrompt('prose'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setCustomPrompt('prose', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.rows = 4;
                text.inputEl.style.width = '100%';
            })
            .addButton(button => {
                button
                    .setButtonText('Reset')
                    .setTooltip('Reset to default prompt')
                    .onClick(async () => {
                        this.plugin.settingsManager.setCustomPrompt('prose', '');
                        await this.plugin.settingsManager.saveSettings();
                        this.display();
                    });
            });

        // Todo Format Prompt
        new Setting(containerEl)
            .setName('To-Do List Format Prompt')
            .setDesc('Custom prompt for reformatting text into actionable to-do items')
            .addTextArea(text => {
                text
                    .setPlaceholder(PromptBuilder.getDefaultPrompt(FormatType.TODO))
                    .setValue(this.plugin.settingsManager.getCustomPrompt('todo'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setCustomPrompt('todo', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.rows = 4;
                text.inputEl.style.width = '100%';
            })
            .addButton(button => {
                button
                    .setButtonText('Reset')
                    .setTooltip('Reset to default prompt')
                    .onClick(async () => {
                        this.plugin.settingsManager.setCustomPrompt('todo', '');
                        await this.plugin.settingsManager.saveSettings();
                        this.display();
                    });
            });

            // Custom Format Prompt
            new Setting(containerEl)
            .setName('Custom Format Prompt')
            .setDesc('Custom prompt for reformatting text')
            .addTextArea(text => {
                text
                    .setPlaceholder(PromptBuilder.getDefaultPrompt(FormatType.CUSTOM))
                    .setValue(this.plugin.settingsManager.getCustomPrompt('custom'))
                    .onChange(async (value) => {
                        this.plugin.settingsManager.setCustomPrompt('custom', value);
                        await this.plugin.settingsManager.saveSettings();
                    });
                text.inputEl.rows = 4;
                text.inputEl.style.width = '100%';
            })
            .addButton(button => {
                button
                    .setButtonText('Reset')
                    .setTooltip('Reset to default prompt')
                    .onClick(async () => {
                        this.plugin.settingsManager.setCustomPrompt('custom', '');
                        await this.plugin.settingsManager.saveSettings();
                        this.display();
                    });
            });
    }

    private addAdvancedSettings(): void {
        const { containerEl } = this;

        containerEl.createEl('h3', { text: 'Advanced Settings' });

        new Setting(containerEl)
            .setName('Max Tokens')
            .setDesc('Maximum number of tokens to use for AI responses (affects cost and response length)')
            .addSlider(slider => {
                slider
                    .setLimits(1000, 8000, 500)
                    .setValue(this.plugin.settingsManager.getSettings().maxTokens)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settingsManager.updateSettings({ maxTokens: value });
                        await this.plugin.settingsManager.saveSettings();
                    });
            });
    }

    private async testConnection(service: AIService): Promise<void> {
        const originalService = this.plugin.settingsManager.getSettings().selectedService;
        
        try {
            // Temporarily switch to the service we want to test
            this.plugin.settingsManager.updateSettings({ selectedService: service });
            
            const result = await this.plugin.textProcessor.testConnection();
            
            if (result.success) {
                ErrorHandler.showSimpleNotification(result.message, 'info');
            } else {
                ErrorHandler.showSimpleNotification(result.message, 'error');
            }
        } catch (error) {
            ErrorHandler.showSimpleNotification(`Connection test failed: ${error.message}`, 'error');
        } finally {
            // Restore original service selection
            this.plugin.settingsManager.updateSettings({ selectedService: originalService });
        }
    }
}

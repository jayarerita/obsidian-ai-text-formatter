import { Plugin } from 'obsidian';
import { AITextFormatterSettings, DEFAULT_SETTINGS } from './types';

export class SettingsManager {
    private plugin: Plugin;
    private settings: AITextFormatterSettings;

    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this.settings = { ...DEFAULT_SETTINGS };
    }

    async loadSettings(): Promise<void> {
        const loadedData = await this.plugin.loadData();
        if (loadedData) {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
        }
    }

    async saveSettings(): Promise<void> {
        await this.plugin.saveData(this.settings);
    }

    getSettings(): AITextFormatterSettings {
        return { ...this.settings };
    }

    updateSettings(newSettings: Partial<AITextFormatterSettings>): void {
        this.settings = Object.assign(this.settings, newSettings);
    }

    getApiKey(service: string): string {
        return this.settings.apiKeys[service as keyof typeof this.settings.apiKeys] || '';
    }

    setApiKey(service: string, key: string): void {
        this.settings.apiKeys[service as keyof typeof this.settings.apiKeys] = key;
    }

    getSelectedModel(service: string): string {
        return this.settings.selectedModels[service as keyof typeof this.settings.selectedModels] || '';
    }

    setSelectedModel(service: string, model: string): void {
        this.settings.selectedModels[service as keyof typeof this.settings.selectedModels] = model;
    }

    getCustomPrompt(format: string): string {
        return this.settings.customPrompts[format as keyof typeof this.settings.customPrompts] || '';
    }

    setCustomPrompt(format: string, prompt: string): void {
        this.settings.customPrompts[format as keyof typeof this.settings.customPrompts] = prompt;
    }

    isConfigured(): boolean {
        const selectedService = this.settings.selectedService;
        const apiKey = this.getApiKey(selectedService);
        return apiKey.length > 0;
    }

    getCurrentModel(): string {
        const selectedService = this.settings.selectedService;
        return this.getSelectedModel(selectedService);
    }

    setCurrentModel(model: string): void {
        const selectedService = this.settings.selectedService;
        this.setSelectedModel(selectedService, model);
    }
}

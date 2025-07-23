// Mock implementation of Obsidian API for testing

export class Plugin {
  app: any;
  manifest: any;
  private data: any = {};

  constructor(app: any, manifest: any) {
    this.app = app;
    this.manifest = manifest;
  }

  async loadData() {
    return this.data;
  }

  async saveData(data: any) {
    this.data = { ...data };
  }

  addCommand(command: any) {
    // Mock command registration
  }

  addSettingTab(tab: any) {
    // Mock settings tab registration
  }

  registerEvent(event: any) {
    // Mock event registration
  }

  onload() {
    // Mock onload
  }

  onunload() {
    // Mock onunload
  }
}

export class Editor {
  private selection = '';
  private cursor = { line: 0, ch: 0 };

  getSelection(): string {
    return this.selection;
  }

  setSelection(text: string) {
    this.selection = text;
  }

  getCursor(type?: string) {
    return this.cursor;
  }

  setCursor(pos: any) {
    this.cursor = pos;
  }

  replaceRange(text: string, from: any, to: any) {
    // Mock replace range
  }

  replaceSelection(text: string) {
    this.selection = text;
  }

  operation(fn: () => void) {
    fn();
  }
}

export class Modal {
  app: any;
  containerEl: HTMLElement;

  constructor(app: any) {
    this.app = app;
    this.containerEl = document.createElement('div');
  }

  open() {
    // Mock modal open
  }

  close() {
    // Mock modal close
  }

  onOpen() {
    // Mock onOpen
  }

  onClose() {
    // Mock onClose
  }
}

export class Setting {
  settingEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.settingEl = document.createElement('div');
  }

  setName(name: string) {
    return this;
  }

  setDesc(desc: string) {
    return this;
  }

  addText(cb: (text: any) => void) {
    const textComponent = {
      setPlaceholder: jest.fn().mockReturnThis(),
      setValue: jest.fn().mockReturnThis(),
      onChange: jest.fn().mockReturnThis(),
      inputEl: document.createElement('input')
    };
    cb(textComponent);
    return this;
  }

  addDropdown(cb: (dropdown: any) => void) {
    const dropdownComponent = {
      addOption: jest.fn().mockReturnThis(),
      setValue: jest.fn().mockReturnThis(),
      onChange: jest.fn().mockReturnThis(),
      selectEl: document.createElement('select')
    };
    cb(dropdownComponent);
    return this;
  }

  addButton(cb: (button: any) => void) {
    const buttonComponent = {
      setButtonText: jest.fn().mockReturnThis(),
      setCta: jest.fn().mockReturnThis(),
      onClick: jest.fn().mockReturnThis(),
      buttonEl: document.createElement('button')
    };
    cb(buttonComponent);
    return this;
  }

  addTextArea(cb: (textArea: any) => void) {
    const textAreaComponent = {
      setPlaceholder: jest.fn().mockReturnThis(),
      setValue: jest.fn().mockReturnThis(),
      onChange: jest.fn().mockReturnThis(),
      inputEl: document.createElement('textarea')
    };
    cb(textAreaComponent);
    return this;
  }
}

export class PluginSettingTab {
  app: any;
  plugin: any;
  containerEl: HTMLElement;

  constructor(app: any, plugin: any) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = document.createElement('div');
  }

  display() {
    // Mock display
  }

  hide() {
    // Mock hide
  }
}

export class Notice {
  constructor(message: string, timeout?: number) {
    // Mock notice
  }
}

// Mock requestUrl function
export const requestUrl = jest.fn().mockResolvedValue({
  status: 200,
  text: 'Mock response',
  json: { success: true }
});

// Mock normalizePath function
export const normalizePath = jest.fn((path: string) => path);

// Mock addIcon function
export const addIcon = jest.fn();

// Mock setIcon function
export const setIcon = jest.fn();

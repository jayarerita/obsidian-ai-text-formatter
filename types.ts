// Core types and interfaces for AI Text Formatter plugin

export enum FormatType {
	NOTES = "notes",
	PROSE = "prose",
	TODO = "todo",
	CUSTOM = "custom",
}

export enum AIService {
	OPENAI = "openai",
	GEMINI = "gemini",
	CLAUDE = "claude",
}

export interface AIResponse {
	success: boolean;
	content?: string;
	error?: string;
	tokensUsed?: number;
}

export interface ProcessingResult {
	originalText: string;
	formattedText: string;
	format: FormatType;
	timestamp: Date;
}

export interface AITextFormatterSettings {
	selectedService: AIService;
	apiKeys: {
		openai: string;
		gemini: string;
		claude: string;
	};
	selectedModels: {
		openai: string;
		gemini: string;
		claude: string;
	};
	customPrompts: {
		notes: string;
		prose: string;
		todo: string;
		custom: string;
	};
	maxTokens: number;
}

export const DEFAULT_SETTINGS: AITextFormatterSettings = {
	selectedService: AIService.OPENAI,
	apiKeys: {
		openai: "",
		gemini: "",
		claude: "",
	},
	selectedModels: {
		openai: "gpt-3.5-turbo",
		gemini: "gemini-2.0-flash-lite",
		claude: "claude-3-5-sonnet-20241022",
	},
	customPrompts: {
		notes: "",
		prose: "",
		todo: "",
		custom: "",
	},
	maxTokens: 4000,
};

// Available models for each service
export const AVAILABLE_MODELS = {
	openai: [
		"gpt-3.5-turbo",
		"gpt-3.5-turbo-16k",
		"gpt-4",
		"gpt-4-turbo-preview",
		"gpt-4o",
		"gpt-4o-mini",
	],
	gemini: [
		"gemini-2.5-pro",
		"gemini-2.5-flash",
		"gemini-2.5-flash-lite-preview-06-17",
		"gemini-2.5-flash-preview-native-audio-dialog",
		"gemini-2.5-flash-exp-native-audio-thinking-dialog",
		"gemini-2.5-flash-preview-tts",
		"gemini-2.5-pro-preview-tts",
		"gemini-2.0-flash",
		"gemini-2.0-flash-preview-image-generation",
		"gemini-2.0-flash-lite",
		"gemini-1.5-flash",
		"gemini-1.5-pro",
		"gemini-1.0-pro",
	],
	claude: [
		"claude-3-5-sonnet-20241022",
		"claude-3-5-haiku-20241022",
		"claude-3-opus-20240229",
		"claude-3-sonnet-20240229",
		"claude-3-haiku-20240307",
	],
};

// Model information for display and cost estimation
export const MODEL_INFO = {
	// OpenAI Models
	"gpt-3.5-turbo": {
		name: "GPT-3.5 Turbo",
		contextLength: 4096,
		costPer1kTokens: 0.002,
		description: "Fast and cost-effective",
	},
	"gpt-3.5-turbo-16k": {
		name: "GPT-3.5 Turbo 16K",
		contextLength: 16384,
		costPer1kTokens: 0.004,
		description: "Larger context window",
	},
	"gpt-4": {
		name: "GPT-4",
		contextLength: 8192,
		costPer1kTokens: 0.03,
		description: "Most capable, higher cost",
	},
	"gpt-4-turbo-preview": {
		name: "GPT-4 Turbo",
		contextLength: 128000,
		costPer1kTokens: 0.01,
		description: "Large context, balanced cost",
	},
	"gpt-4o": {
		name: "GPT-4o",
		contextLength: 128000,
		costPer1kTokens: 0.005,
		description: "Latest and most capable",
	},
	"gpt-4o-mini": {
		name: "GPT-4o Mini",
		contextLength: 128000,
		costPer1kTokens: 0.00015,
		description: "Smallest and most affordable",
	},

	// Gemini Models
	"gemini-2.5-pro": {
		name: "Gemini 2.5 Pro",
		contextLength: 2000000,
		costPer1kTokens: 0.001,
		description:
			"Enhanced thinking and reasoning, multimodal understanding, advanced coding",
	},
	"gemini-2.5-flash": {
		name: "Gemini 2.5 Flash",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description: "Adaptive thinking, cost efficiency",
	},
	"gemini-2.5-flash-lite-preview-06-17": {
		name: "Gemini 2.5 Flash-Lite Preview",
		contextLength: 1000000,
		costPer1kTokens: 0.00005,
		description: "Most cost-efficient model supporting high throughput",
	},
	"gemini-2.5-flash-preview-native-audio-dialog": {
		name: "Gemini 2.5 Flash Native Audio",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description: "High quality, natural conversational audio outputs",
	},
	"gemini-2.5-flash-exp-native-audio-thinking-dialog": {
		name: "Gemini 2.5 Flash Native Audio Thinking",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description: "Natural conversational audio with thinking",
	},
	"gemini-2.5-flash-preview-tts": {
		name: "Gemini 2.5 Flash Preview TTS",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description:
			"Low latency, controllable text-to-speech audio generation",
	},
	"gemini-2.5-pro-preview-tts": {
		name: "Gemini 2.5 Pro Preview TTS",
		contextLength: 2000000,
		costPer1kTokens: 0.001,
		description:
			"Low latency, controllable text-to-speech audio generation",
	},
	"gemini-2.0-flash": {
		name: "Gemini 2.0 Flash",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description: "Next generation features, speed, and realtime streaming",
	},
	"gemini-2.0-flash-preview-image-generation": {
		name: "Gemini 2.0 Flash Preview Image Generation",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description: "Conversational image generation and editing",
	},
	"gemini-2.0-flash-lite": {
		name: "Gemini 2.0 Flash-Lite",
		contextLength: 1000000,
		costPer1kTokens: 0.00005,
		description: "Cost efficiency and low latency",
	},
	"gemini-1.5-flash": {
		name: "Gemini 1.5 Flash",
		contextLength: 1000000,
		costPer1kTokens: 0.0001,
		description: "Fastest and most cost-effective",
	},
	"gemini-1.5-pro": {
		name: "Gemini 1.5 Pro",
		contextLength: 1000000,
		costPer1kTokens: 0.001,
		description: "Most capable Gemini model",
	},
	"gemini-1.0-pro": {
		name: "Gemini 1.0 Pro",
		contextLength: 30720,
		costPer1kTokens: 0.0005,
		description: "Legacy model",
	},

	// Claude Models
	"claude-3-5-sonnet-20241022": {
		name: "Claude 3.5 Sonnet",
		contextLength: 200000,
		costPer1kTokens: 0.003,
		description: "Latest and most balanced",
	},
	"claude-3-5-haiku-20241022": {
		name: "Claude 3.5 Haiku",
		contextLength: 200000,
		costPer1kTokens: 0.00025,
		description: "Fastest Claude model",
	},
	"claude-3-opus-20240229": {
		name: "Claude 3 Opus",
		contextLength: 200000,
		costPer1kTokens: 0.015,
		description: "Most capable, highest cost",
	},
	"claude-3-sonnet-20240229": {
		name: "Claude 3 Sonnet",
		contextLength: 200000,
		costPer1kTokens: 0.003,
		description: "Balanced performance",
	},
	"claude-3-haiku-20240307": {
		name: "Claude 3 Haiku",
		contextLength: 200000,
		costPer1kTokens: 0.00025,
		description: "Fast and affordable",
	},
};

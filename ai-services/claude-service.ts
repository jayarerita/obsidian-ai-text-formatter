import { BaseAIService } from "./base-service";
import { AIResponse } from "../types";

interface ClaudeMessage {
	role: "user" | "assistant";
	content: string;
}

interface ClaudeRequest {
	model: string;
	max_tokens: number;
	messages: ClaudeMessage[];
	temperature?: number;
	top_p?: number;
	top_k?: number;
	system?: string;
}

interface ClaudeResponse {
	content: Array<{
		text: string;
		type: string;
	}>;
	usage: {
		input_tokens: number;
		output_tokens: number;
	};
	stop_reason: string;
	model: string;
}

interface ClaudeError {
	error: {
		type: string;
		message: string;
	};
}

export class ClaudeService extends BaseAIService {
	private readonly baseUrl = "https://api.anthropic.com/v1";
	private modelName = "claude-3-5-sonnet-20241022";
	private readonly anthropicVersion = "2023-06-01";

	constructor(apiKey: string, maxTokens = 1000) {
		super(apiKey, maxTokens);
	}

	async generateText(prompt: string): Promise<AIResponse> {
		if (!this.validateApiKey()) {
			return this.createErrorResponse("Invalid Claude API key");
		}

		try {
			console.log(
				`Claude: Using model ${this.modelName} with prompt length: ${prompt.length}`
			);

			const requestBody: ClaudeRequest = {
				model: this.modelName,
				max_tokens: this.maxTokens,
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: 0.7,
				top_p: 0.9,
				top_k: 40,
			};

			const response = await this.makeHttpRequest(
				`${this.baseUrl}/messages`,
				{
					method: "POST",
					headers: {
						"x-api-key": this.apiKey,
						"anthropic-version": this.anthropicVersion,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody),
				}
			);

			if (!response.ok) {
				const errorData: ClaudeError = await response.json();
				throw new Error(
					`HTTP ${response.status}: ${
						errorData.error?.message || response.statusText
					}`
				);
			}

			const data: ClaudeResponse = await response.json();

			if (data.content && data.content.length > 0) {
				const content = data.content[0].text.trim();
				const tokensUsed = data.usage
					? data.usage.input_tokens + data.usage.output_tokens
					: undefined;

				console.log(
					`Claude: Successfully generated ${
						content.length
					} characters, used ${tokensUsed || "unknown"} tokens`
				);
				return this.createSuccessResponse(content, tokensUsed);
			} else {
				return this.createErrorResponse(
					"No response generated from Claude"
				);
			}
		} catch (error) {
			console.error("Claude API Error:", error);

			// Handle specific Claude API errors
			if (
				error.message?.includes("invalid_api_key") ||
				error.message?.includes("authentication")
			) {
				return this.createErrorResponse(
					"Invalid Claude API key. Please check your API key in settings."
				);
			} else if (
				error.message?.includes("insufficient_quota") ||
				error.message?.includes("quota") ||
				error.message?.includes("billing")
			) {
				return this.createErrorResponse(
					"Claude API quota exceeded. Please check your usage limits or billing information."
				);
			} else if (
				error.message?.includes("rate_limit_exceeded") ||
				error.message?.includes("rate limit")
			) {
				return this.createErrorResponse(
					"Claude API rate limit exceeded. Please try again later or upgrade your plan."
				);
			} else if (
				error.message?.includes("model_not_found") ||
				error.message?.includes("does not exist")
			) {
				return this.createErrorResponse(
					`Claude model '${this.modelName}' not found. Please try a different model.`
				);
			} else if (
				error.message?.includes("max_tokens") ||
				error.message?.includes("context_length")
			) {
				return this.createErrorResponse(
					"Text is too long for Claude API. Please select shorter text or adjust max tokens."
				);
			} else if (
				error.message?.includes("content_filter") ||
				error.message?.includes("safety")
			) {
				return this.createErrorResponse(
					"Content was blocked by Claude safety filters. Please try different text."
				);
			} else if (
				error.message?.includes("overloaded") ||
				error.message?.includes("capacity")
			) {
				return this.createErrorResponse(
					"Claude API is currently overloaded. Please try again in a few moments."
				);
			} else if (
				error.message?.includes("401") ||
				error.message?.includes("Unauthorized")
			) {
				return this.createErrorResponse(
					"Unauthorized access to Claude API. Please check your API key."
				);
			} else if (
				error.message?.includes("403") ||
				error.message?.includes("Forbidden")
			) {
				return this.createErrorResponse(
					"Access denied to Claude API. Please check your API key permissions."
				);
			} else if (error.message?.includes("429")) {
				return this.createErrorResponse(
					"Too many requests to Claude API. Please wait and try again."
				);
			} else if (
				error.message?.includes("500") ||
				error.message?.includes("502") ||
				error.message?.includes("503")
			) {
				return this.createErrorResponse(
					"Claude API is temporarily unavailable. Please try again later."
				);
			} else {
				return this.createErrorResponse(
					`Claude API error: ${error.message || "Unknown error"}`
				);
			}
		}
	}

	validateApiKey(): boolean {
		return !!(
			this.apiKey &&
			this.apiKey.startsWith("sk-ant-") &&
			this.apiKey.length > 20
		);
	}

	getMaxTokens(): number {
		return this.maxTokens;
	}

	getServiceName(): string {
		return "Anthropic Claude";
	}

	// Method to update API key
	updateApiKey(newApiKey: string): void {
		this.apiKey = newApiKey;
	}

	// Method to update max tokens
	updateMaxTokens(newMaxTokens: number): void {
		this.maxTokens = newMaxTokens;
	}

	// Method to test the connection
	async testConnection(): Promise<boolean> {
		if (!this.validateApiKey()) {
			return false;
		}

		try {
			const testResponse = await this.generateText(
				"Hello, this is a test message."
			);
			return testResponse.success;
		} catch (error) {
			console.error("Claude connection test failed:", error);
			return false;
		}
	}

	// Method to get available models
	getAvailableModels(): string[] {
		return [
			"claude-3-5-sonnet-20241022",
			"claude-3-5-haiku-20241022",
			"claude-3-opus-20240229",
			"claude-3-sonnet-20240229",
			"claude-3-haiku-20240307",
		];
	}

	// Method to switch model
	switchModel(modelName: string): void {
		if (this.getAvailableModels().includes(modelName)) {
			this.modelName = modelName;
		} else {
			throw new Error(
				`Unsupported Claude model: ${modelName}. Available models: ${this.getAvailableModels().join(
					", "
				)}`
			);
		}
	}

	// Method to get current model
	getCurrentModel(): string {
		return this.modelName;
	}

	// Method to get model info
	getModelInfo(): {
		name: string;
		contextLength: number;
		costPer1kTokens: number;
	} {
		const modelInfo: Record<
			string,
			{ contextLength: number; costPer1kTokens: number }
		> = {
			"claude-3-5-sonnet-20241022": {
				contextLength: 200000,
				costPer1kTokens: 0.003,
			},
			"claude-3-5-haiku-20241022": {
				contextLength: 200000,
				costPer1kTokens: 0.00025,
			},
			"claude-3-opus-20240229": {
				contextLength: 200000,
				costPer1kTokens: 0.015,
			},
			"claude-3-sonnet-20240229": {
				contextLength: 200000,
				costPer1kTokens: 0.003,
			},
			"claude-3-haiku-20240307": {
				contextLength: 200000,
				costPer1kTokens: 0.00025,
			},
		};

		return {
			name: this.modelName,
			...(modelInfo[this.modelName] || {
				contextLength: 200000,
				costPer1kTokens: 0.003,
			}),
		};
	}

	// Method to set system prompt (Claude-specific feature)
	setSystemPrompt(_systemPrompt: string): void {
		// This would be used in generateText if we want to add system prompts
		// For now, just store it for future use
	}

	// Method to get recommended model for task
	getRecommendedModel(taskType: "speed" | "quality" | "cost"): string {
		switch (taskType) {
			case "speed":
				return "claude-3-5-haiku-20241022";
			case "quality":
				return "claude-3-5-sonnet-20241022";
			case "cost":
				return "claude-3-5-haiku-20241022";
			default:
				return "claude-3-5-sonnet-20241022";
		}
	}
}

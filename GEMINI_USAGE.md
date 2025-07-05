# Gemini Service Usage

The GeminiService has been refactored to use the official Google Generative AI JavaScript SDK (`@google/generative-ai`). This provides better error handling, type safety, and access to the latest features.

## Key Improvements

1. **Official SDK Integration**: Uses Google's official JavaScript SDK instead of raw HTTP requests
2. **Better Error Handling**: Specific error messages for different API error types
3. **Enhanced Validation**: More specific API key validation (checks for 'AIza' prefix)
4. **Configuration Options**: Support for temperature, topP, topK parameters
5. **Connection Testing**: Built-in method to test API connectivity
6. **Model Switching**: Support for different Gemini models (extensible for future models)

## Basic Usage

```typescript
import { GeminiService } from './ai-services/gemini-service';

// Initialize the service
const geminiService = new GeminiService('your-api-key-here', 1000);

// Generate text
const response = await geminiService.generateText('Reformat this text into bullet points: Hello world this is a test');

if (response.success) {
    console.log('Generated text:', response.content);
    console.log('Tokens used:', response.tokensUsed);
} else {
    console.error('Error:', response.error);
}
```

## Advanced Features

### Test Connection
```typescript
const isConnected = await geminiService.testConnection();
if (isConnected) {
    console.log('Gemini service is working correctly');
}
```

### Update Configuration
```typescript
// Update API key
geminiService.updateApiKey('new-api-key');

// Update max tokens
geminiService.updateMaxTokens(2000);
```

### Switch Models
```typescript
// Switch to vision model (for future image support)
geminiService.switchModel('gemini-pro-vision');

// Get available models
const models = geminiService.getAvailableModels();
console.log('Available models:', models);
```

## Error Handling

The service provides specific error messages for common issues:

- **Invalid API Key**: "Invalid Gemini API key. Please check your API key in settings."
- **Quota Exceeded**: "Gemini API quota exceeded. Please check your usage limits."
- **Rate Limit**: "Gemini API rate limit exceeded. Please try again later."
- **Safety Filters**: "Content was blocked by Gemini safety filters. Please try different text."
- **Recitation**: "Content may contain copyrighted material. Please try different text."

## Configuration Parameters

The service supports the following generation parameters:

- `maxOutputTokens`: Maximum number of tokens in the response
- `temperature`: Controls randomness (0.0 to 1.0)
- `topP`: Controls diversity via nucleus sampling
- `topK`: Controls diversity by limiting token choices

Default values:
```typescript
{
    maxOutputTokens: maxTokens, // From constructor
    temperature: 0.7,
    topP: 0.8,
    topK: 40
}
```

## Migration from Old Implementation

If you were using the old HTTP-based implementation, the main changes are:

1. **Constructor**: Same signature, but now initializes the SDK internally
2. **Error Handling**: More specific error messages
3. **Validation**: API keys must start with 'AIza'
4. **New Methods**: `testConnection()`, `updateApiKey()`, `updateMaxTokens()`, `switchModel()`

The `generateText()` method signature remains the same, so existing code should work without changes.

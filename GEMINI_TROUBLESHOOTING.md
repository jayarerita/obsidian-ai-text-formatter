# Gemini API Troubleshooting Guide

## Common 404 Error Fix

If you're getting a `404 (Not Found)` error when using the Gemini service, this is likely due to model name changes in Google's API.

### Quick Fix

The plugin has been updated to use `gemini-1.5-flash` as the default model. If you're still getting 404 errors, try these steps:

1. **Update your plugin** to the latest version
2. **Try different models** in this order:
   - `gemini-1.5-flash` (fastest, most cost-effective)
   - `gemini-1.5-pro` (more capable, higher cost)
   - `gemini-1.0-pro` (legacy model)

### Manual Model Switching

If you need to manually switch models, you can do so programmatically:

```typescript
// In your code, after creating the service
const geminiService = new GeminiService(apiKey, maxTokens);

// Try switching to a different model
try {
    geminiService.switchModel('gemini-1.5-pro');
} catch (error) {
    console.log('Model switch failed:', error.message);
}
```

### API Key Issues

Make sure your Gemini API key:
- Starts with `AIza`
- Is longer than 10 characters
- Has the necessary permissions enabled in Google Cloud Console
- Has billing enabled (required for Gemini API)

### Error Messages and Solutions

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| `404 Not Found` | Model name deprecated/changed | Update plugin or switch model |
| `403 Forbidden` | API key lacks permissions | Check Google Cloud Console permissions |
| `Invalid API key` | Wrong key format or expired | Verify key starts with `AIza` |
| `Quota exceeded` | Usage limits reached | Check billing and quotas in Google Cloud |
| `Rate limit exceeded` | Too many requests | Wait and retry, or upgrade plan |

### Testing Your Setup

Use the built-in connection test:

```typescript
const geminiService = new GeminiService(yourApiKey);
const isWorking = await geminiService.testConnection();

if (isWorking) {
    console.log('Gemini service is working correctly');
} else {
    console.log('Gemini service has issues - check your API key and settings');
}
```

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Generative Language API"
3. Create an API key with appropriate restrictions
4. Ensure billing is enabled for your project
5. Set appropriate quotas for your usage

### Model Availability

Current available models (as of 2024):
- `gemini-1.5-flash` - Fast and efficient, good for most use cases
- `gemini-1.5-pro` - More capable, better for complex tasks
- `gemini-1.0-pro` - Legacy model, may be deprecated soon

### Debug Mode

Enable console logging to see detailed error information:
1. Open browser developer tools (F12)
2. Look for Gemini-related console messages
3. Check for specific error details in the console

### Still Having Issues?

If you're still experiencing problems:

1. Check the [Google AI Studio](https://makersuite.google.com/) to test your API key directly
2. Verify your API key works with a simple curl request:
   ```bash
   curl -H 'Content-Type: application/json' \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
        -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY"
   ```
3. Check Google's [Gemini API documentation](https://ai.google.dev/docs) for the latest updates
4. Report the issue with full error details if the problem persists

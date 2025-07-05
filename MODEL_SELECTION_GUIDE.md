# Model Selection Guide

The AI Text Formatter plugin now supports selecting specific models for each AI service. This allows you to optimize for different use cases based on speed, quality, cost, and context length requirements.

## 🎯 How to Select Models

### In Settings
1. Go to **Settings → AI Text Formatter**
2. Navigate to the **Model Selection** section
3. Choose your preferred model for each service:
   - **OpenAI Model**: Select from GPT-3.5 to GPT-4o variants
   - **Gemini Model**: Choose between Gemini 1.5 Flash, Pro, or legacy models
   - **Claude Model**: Pick from Claude 3 and 3.5 series models

### Model Information Display
Each model shows:
- **Name**: Human-readable model name
- **Description**: Brief capability summary
- **Context Length**: Maximum input/output tokens
- **Cost**: Approximate cost per 1,000 tokens

## 📊 Available Models

### OpenAI Models

| Model | Name | Context | Cost/1K | Best For |
|-------|------|---------|---------|----------|
| `gpt-3.5-turbo` | GPT-3.5 Turbo | 4K | $0.002 | Cost-effective, fast |
| `gpt-3.5-turbo-16k` | GPT-3.5 Turbo 16K | 16K | $0.004 | Longer texts |
| `gpt-4` | GPT-4 | 8K | $0.030 | High quality |
| `gpt-4-turbo-preview` | GPT-4 Turbo | 128K | $0.010 | Large context |
| `gpt-4o` | GPT-4o | 128K | $0.005 | Latest, most capable |
| `gpt-4o-mini` | GPT-4o Mini | 128K | $0.00015 | Most affordable |

### Google Gemini Models

| Model | Name | Context | Cost/1K | Best For |
|-------|------|---------|---------|----------|
| `gemini-1.5-flash` | Gemini 1.5 Flash | 1M | $0.0001 | Speed, cost efficiency |
| `gemini-1.5-pro` | Gemini 1.5 Pro | 1M | $0.001 | Quality, large context |
| `gemini-1.0-pro` | Gemini 1.0 Pro | 30K | $0.0005 | Legacy support |

### Anthropic Claude Models

| Model | Name | Context | Cost/1K | Best For |
|-------|------|---------|---------|----------|
| `claude-3-5-sonnet-20241022` | Claude 3.5 Sonnet | 200K | $0.003 | Latest, balanced |
| `claude-3-5-haiku-20241022` | Claude 3.5 Haiku | 200K | $0.00025 | Speed, efficiency |
| `claude-3-opus-20240229` | Claude 3 Opus | 200K | $0.015 | Highest quality |
| `claude-3-sonnet-20240229` | Claude 3 Sonnet | 200K | $0.003 | Balanced performance |
| `claude-3-haiku-20240307` | Claude 3 Haiku | 200K | $0.00025 | Fast, affordable |

## 🎯 Model Selection Strategies

### For Different Use Cases

#### 💰 **Cost Optimization**
- **OpenAI**: `gpt-4o-mini` - Most affordable GPT-4 quality
- **Gemini**: `gemini-1.5-flash` - Extremely cost-effective
- **Claude**: `claude-3-5-haiku-20241022` - Fast and cheap

#### ⚡ **Speed Priority**
- **OpenAI**: `gpt-3.5-turbo` - Fastest response times
- **Gemini**: `gemini-1.5-flash` - Optimized for speed
- **Claude**: `claude-3-5-haiku-20241022` - Quickest Claude model

#### 🎯 **Quality Focus**
- **OpenAI**: `gpt-4o` - Latest and most capable
- **Gemini**: `gemini-1.5-pro` - Most advanced Gemini
- **Claude**: `claude-3-5-sonnet-20241022` - Latest Claude

#### 📄 **Long Documents**
- **OpenAI**: `gpt-4-turbo-preview` or `gpt-4o` - 128K context
- **Gemini**: `gemini-1.5-pro` - 1M context (largest)
- **Claude**: Any Claude 3/3.5 model - 200K context

### For Different Text Types

#### 📝 **Voice Transcriptions**
- **Recommended**: `gpt-3.5-turbo`, `gemini-1.5-flash`, `claude-3-5-haiku`
- **Reason**: Fast processing, good at grammar correction

#### 📋 **Meeting Notes**
- **Recommended**: `gpt-4o-mini`, `gemini-1.5-pro`, `claude-3-5-sonnet`
- **Reason**: Better structure understanding, context awareness

#### ✅ **Task Lists**
- **Recommended**: `gpt-3.5-turbo`, `gemini-1.5-flash`, `claude-3-5-haiku`
- **Reason**: Simple task, cost-effective models work well

#### 📚 **Academic/Technical Content**
- **Recommended**: `gpt-4o`, `gemini-1.5-pro`, `claude-3-5-sonnet`
- **Reason**: Better understanding of complex concepts

## ⚙️ Technical Details

### Model Switching
- Models are applied **per service**, not globally
- Changes take effect **immediately** for new requests
- No need to restart Obsidian after changing models

### Settings Storage
```json
{
  "selectedModels": {
    "openai": "gpt-4o-mini",
    "gemini": "gemini-1.5-flash", 
    "claude": "claude-3-5-sonnet-20241022"
  }
}
```

### Programmatic Access
```typescript
// Get current model for active service
const currentModel = settingsManager.getCurrentModel();

// Set model for specific service
settingsManager.setSelectedModel('openai', 'gpt-4o');

// Get model for any service
const geminiModel = settingsManager.getSelectedModel('gemini');
```

## 🔧 Troubleshooting

### Model Not Available
- **Error**: "Unsupported model" or "Model not found"
- **Solution**: Check if the model name is correct and available in your region
- **Fallback**: Switch to a different model from the same service

### Unexpected Costs
- **Monitor**: Check the cost information displayed in settings
- **Optimize**: Switch to more cost-effective models for routine tasks
- **Budget**: Set usage limits in your AI service dashboard

### Performance Issues
- **Slow responses**: Switch to faster models (Haiku, Flash, Turbo)
- **Quality issues**: Upgrade to more capable models (Sonnet, Pro, GPT-4)
- **Context limits**: Use models with larger context windows for long texts

## 📈 Best Practices

### 1. **Start with Defaults**
The plugin sets sensible defaults for each service. Try these first before customizing.

### 2. **Match Model to Task**
- Simple formatting → Fast, cheap models
- Complex restructuring → Capable, premium models

### 3. **Monitor Usage**
- Check your AI service dashboards regularly
- Use connection testing to verify model availability
- Switch models if you hit rate limits

### 4. **Experiment**
- Try different models for the same text
- Compare quality vs. cost trade-offs
- Find your optimal model for different use cases

### 5. **Stay Updated**
- New models are added regularly
- Check for plugin updates to access latest models
- Review model pricing changes from AI providers

## 🔮 Future Enhancements

### Planned Features
- **Auto Model Selection**: Automatically choose optimal model based on text length/complexity
- **Usage Analytics**: Track costs and usage per model
- **Model Recommendations**: Suggest best model for specific tasks
- **Batch Processing**: Use different models for different format types

### Model Roadmap
- Support for new models as they're released
- Integration with additional AI services
- Custom model endpoints for enterprise users

---

**Note**: Model availability and pricing may vary by region and change over time. Always check the official AI service documentation for the most current information.

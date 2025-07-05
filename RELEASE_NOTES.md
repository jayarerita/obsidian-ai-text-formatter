# Release Notes

## Version 1.1.0 - Enhanced AI Services & Error Handling

### 🚀 Major Improvements

#### Enhanced Error Handling
- **Specific Error Messages**: All AI services now provide clear, actionable error messages
- **Service-Specific Guidance**: Tailored error messages for OpenAI, Gemini, and Claude
- **Better User Experience**: Users know exactly what to do when errors occur

#### Updated AI Models
- **OpenAI**: Added support for GPT-4o, GPT-4o-mini, GPT-4-turbo-preview
- **Claude**: Updated to Claude 3.5 series (claude-3-5-sonnet-20241022, claude-3-5-haiku-20241022)
- **Gemini**: Fixed 404 errors by updating to gemini-1.5-flash and gemini-1.5-pro

#### Model Management
- **Model Switching**: Change AI models on the fly for different use cases
- **Cost Information**: See pricing details for each model
- **Performance Optimization**: Choose models based on speed, quality, or cost needs

#### Connection Testing
- **Built-in Testing**: Test API connectivity before making requests
- **Troubleshooting**: Easier diagnosis of configuration issues
- **Reliability**: Verify service availability

### 🔧 Technical Improvements

#### Code Quality
- **TypeScript Improvements**: Better type safety with proper Editor types
- **Error Recovery**: Enhanced error handling and recovery mechanisms
- **Debug Logging**: Comprehensive logging for troubleshooting

#### API Integration
- **Google Generative AI SDK**: Migrated Gemini service to official SDK
- **Enhanced Parameters**: Better control over AI generation parameters
- **Token Tracking**: Improved usage monitoring and cost estimation

### 🐛 Bug Fixes

#### Editor Operations
- **Fixed**: `editor.operation is not a function` error
- **Improved**: Text replacement and cursor positioning
- **Enhanced**: Editor API compatibility

#### API Connectivity
- **Fixed**: Gemini 404 "Not Found" errors
- **Improved**: Error detection and handling across all services
- **Enhanced**: Connection reliability and retry logic

### 📊 New Features

#### Service Management
- `getAvailableModels()`: List supported models for each service
- `switchModel()`: Change active model
- `testConnection()`: Test API connectivity
- `getModelInfo()`: Get model details and pricing

#### Enhanced Configuration
- **Dynamic Updates**: Change API keys and settings without restart
- **Service Validation**: Better API key validation for each service
- **Cost Optimization**: Model recommendations based on use case

### 🔄 Migration Notes

#### Backward Compatibility
- **Fully Compatible**: Existing installations will continue to work
- **No Breaking Changes**: All existing method signatures preserved
- **Automatic Updates**: New features are additive and optional

#### Recommended Actions
1. **Test Connection**: Use the new "Test" button in settings
2. **Update Models**: Consider switching to newer, more efficient models
3. **Check Logs**: Enable browser console to see detailed operation logs

### 📈 Performance Improvements

#### Response Times
- **Faster Processing**: Optimized API calls and response handling
- **Better Caching**: Improved service initialization and reuse
- **Reduced Overhead**: Streamlined error handling and logging

#### Resource Usage
- **Memory Optimization**: Better service lifecycle management
- **Network Efficiency**: Improved request handling and retry logic
- **Token Efficiency**: Better token usage tracking and optimization

### 🎯 User Experience

#### Error Messages
```
Before: "API error: Request failed"
After:  "OpenAI API quota exceeded. Please check your usage limits or add billing information."
```

#### Model Selection
```
Before: Fixed model per service
After:  Choose from 6 OpenAI models, 5 Claude models, 3 Gemini models
```

#### Troubleshooting
```
Before: Generic error handling
After:  Built-in connection testing, detailed logging, specific guidance
```

### 🔮 Future Roadmap

#### Planned Features
- **Batch Processing**: Process multiple text selections
- **Custom Templates**: User-defined formatting templates
- **Usage Analytics**: Detailed cost and usage tracking
- **Offline Mode**: Local processing capabilities

#### Service Expansions
- **New AI Services**: Additional AI provider integrations
- **Specialized Models**: Task-specific model recommendations
- **Advanced Features**: Streaming responses, conversation context

---

### Installation & Upgrade

#### New Installations
1. Download the latest release files
2. Install in `.obsidian/plugins/obsidian-ai-text-formatter/`
3. Enable in Community Plugins settings
4. Configure API keys and test connections

#### Existing Users
1. Replace plugin files with new version
2. Restart Obsidian
3. Test your existing API keys with the new "Test" button
4. Explore new model options in settings

### Support

For issues, questions, or feature requests:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the updated README and troubleshooting guides
- **Community**: Join discussions in GitHub Discussions

---

**Note**: This release significantly improves reliability and user experience. All users are encouraged to upgrade and test their configurations with the new connection testing features.

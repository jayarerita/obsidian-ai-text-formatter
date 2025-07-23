# AI Text Formatter for Obsidian

[![Latest Release](https://img.shields.io/github/v/release/jayarerita/obsidian-ai-text-formatter?style=flat-square&color=blue)](https://github.com/jayarerita/obsidian-ai-text-formatter/releases/latest)
[![Tests](https://github.com/jayarerita/obsidian-ai-text-formatter/actions/workflows/test.yml/badge.svg)](https://github.com/jayarerita/obsidian-ai-text-formatter/actions/workflows/test.yml)
[![Test Coverage](https://codecov.io/gh/jayarerita/obsidian-ai-text-formatter/branch/main/graph/badge.svg)](https://codecov.io/gh/jayarerita/obsidian-ai-text-formatter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple.svg)](https://obsidian.md/)

An Obsidian plugin that uses AI services (OpenAI GPT, Google Gemini, Anthropic Claude) to reformat selected text into structured notes, flowing prose, or actionable to-do lists. Perfect for cleaning up voice-to-text transcriptions and improving text formatting.

## ✨ Features

- **🤖 Multiple AI Services**: Support for OpenAI GPT (3.5/4/4o), Google Gemini (1.5), and Anthropic Claude (3/3.5)
- **🎯 Model Selection**: Choose specific models for each service to optimize for speed, quality, or cost
- **📝 Three Format Types**:
    - **Notes**: Structured notes with headers and bullet points
    - **Prose**: Well-formatted paragraphs with proper grammar
    - **To-Do Lists**: Actionable checkbox items
- **🖱️ Context Menu Integration**: Right-click selected text for quick formatting
- **⌨️ Command Palette**: Access formatting commands via Obsidian's command palette
- **🎨 Custom Prompts**: Customize AI prompts for each format type
- **🔐 Secure API Key Storage**: API keys stored locally and securely
- **🛡️ Comprehensive Error Handling**: User-friendly error messages with specific guidance
- **⚡ Loading States**: Visual feedback during processing
- **🔧 Model Management**: Switch between different AI models for optimal performance
- **🧪 Connection Testing**: Built-in API connectivity testing
- **📊 Usage Tracking**: Token usage monitoring and cost estimation

## 🚀 What's New in v1.1.0

- **Enhanced Error Handling**: Specific, actionable error messages for all AI services
- **Updated AI Models**: Latest models from all providers (GPT-4o, Claude 3.5, Gemini 1.5)
- **Model Selection**: Choose specific models for each service to optimize for your needs
- **Connection Testing**: Test API connectivity before making requests
- **Debug Logging**: Comprehensive logging for troubleshooting
- **Cost Optimization**: Model information with pricing details and recommendations
- **Improved Reliability**: Better error recovery and retry logic
- **Rate Limiting Protection**: Automatic retry with exponential backoff for rate limits
- **Smart Request Throttling**: Built-in delays to prevent API rate limiting

## 📦 Installation

### Manual Installation

1. Download the latest release files (`main.js`, `styles.css`, `manifest.json`)
2. Create a folder named `obsidian-ai-text-formatter` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into this folder
4. Restart Obsidian
5. Enable the plugin in Settings → Community Plugins

### From Community Plugins (Coming Soon)

The plugin will be available in Obsidian's Community Plugins directory once approved.

## ⚙️ Setup

### 1. Get API Keys

You'll need an API key from at least one of these services:

#### OpenAI (Recommended for beginners)

- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Multiple models available with different capabilities and costs

#### Google Gemini (Best value)

- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Competitive pricing with generous free tier

#### Anthropic Claude (Best for complex tasks)

- Get your API key from [Anthropic Console](https://console.anthropic.com/)
- Premium quality models for complex text processing

### 2. Configure the Plugin

1. Go to Settings → AI Text Formatter
2. Select your preferred AI service
3. Enter your API key for the selected service
4. (Optional) Choose a specific model for each service based on your needs
5. (Optional) Test your connection using the "Test" button
6. (Optional) Customize prompts for each format type

### 3. Test Your Setup

Use the "Test Connection" button in settings to verify everything works correctly.

## 🎯 Usage

### Quick Start

1. **Select text** in any note (voice transcription, rough notes, etc.)
2. **Right-click** and choose one of the AI formatting options:
    - **AI Format → Notes**: Convert to structured notes
    - **AI Format → Prose**: Convert to flowing prose
    - **AI Format → To-Do List**: Convert to actionable tasks
3. **Wait** for processing to complete (usually 2-5 seconds)
4. **Review** your beautifully formatted text!

### Available Commands

Access these commands via the Command Palette (Ctrl/Cmd + P):

- **Reformat selected text to Notes**: Direct formatting to structured notes
- **Reformat selected text to Prose**: Direct formatting to flowing prose
- **Reformat selected text to To-Do List**: Direct formatting to actionable tasks
- **Reformat selected text to custom format**: Format with your custom prompt

### Context Menu Options

Right-click on selected text to access:

- **AI Format → Notes**: Direct notes formatting
- **AI Format → Prose**: Direct prose formatting
- **AI Format → To-Do List**: Direct to-do formatting
= **AI Format → Custom**: Custom formatting

## 📋 Format Examples

### Voice Transcription Input

```text
So I was thinking about the project and we need to do several things first we need to
set up the database then we need to create the user interface and also we should
probably test everything before we deploy it to production oh and don't forget to
update the documentation
```

### Notes Format Output

```markdown
# Project Tasks

## Database Setup

- Set up the database infrastructure

## User Interface Development

- Create the user interface components
- Ensure responsive design

## Testing & Deployment

- Test all functionality thoroughly
- Deploy to production environment
- Update project documentation
```

### Prose Format Output

```text
I was considering the project requirements and identified several key tasks that need
to be completed. First, we need to establish the database infrastructure to support
our application. Following that, we should focus on creating an intuitive user
interface that meets our users' needs.

It's crucial that we thoroughly test all functionality before deploying to the
production environment. Additionally, we must ensure that our project documentation
is updated to reflect any changes made during the development process.
```

### To-Do List Format Output

```markdown
- [ ] Set up database infrastructure
- [ ] Create user interface components
- [ ] Implement responsive design
- [ ] Test all functionality thoroughly
- [ ] Deploy to production environment
- [ ] Update project documentation
```

## 🔧 Advanced Configuration

### Model Selection Guide

Each AI service offers multiple models with different capabilities, speeds, and costs. You can select the optimal model for your specific needs based on:

- **Speed & Cost Efficiency**: Choose faster, more economical models for simple formatting tasks
- **Best Quality**: Select premium models for complex text processing and nuanced formatting
- **Long Documents**: Use models with larger context windows for processing lengthy content

### How to Select Models

1. Go to **Settings → AI Text Formatter**
2. Navigate to the **Model Selection** section
3. Choose your preferred model for each service
4. Each model shows context length and capability information
5. Changes take effect immediately for new requests

See the [Model Selection Guide](MODEL_SELECTION_GUIDE.md) for detailed information about all available models.

### Custom Prompts

The plugin allows you to fully customize the AI prompts used for each format type, giving you complete control over how your text is processed and formatted.

#### How to Customize Prompts

1. Go to **Settings → AI Text Formatter**
2. Navigate to the **Custom Prompts** section
3. Edit the prompt for any format type (Notes, Prose, To-Do List)
4. Use `{text}` as a placeholder where your selected text will be inserted
5. Save your changes - they take effect immediately

#### Prompt Guidelines

- **Use `{text}` placeholder**: This is where your selected text will be inserted
- **Be specific**: Clear instructions produce better results
- **Include context**: Mention the desired output format and style
- **Set expectations**: Specify length, tone, and structure requirements

#### Example Custom Prompts

**Meeting Notes Format:**

```text
Transform the following voice transcription into professional meeting notes with clear action items and decisions. Use headers for different topics and bullet points for details: {text}
```

**Academic Writing:**

```text
Rewrite the following rough notes into formal academic prose with proper transitions and scholarly tone. Maintain all key information while improving clarity and flow: {text}
```

**Project Planning:**

```text
Convert the following brainstorming session into a structured project plan with clear phases, deliverables, and actionable tasks: {text}
```

**Email Draft:**

```text
Transform the following rough thoughts into a professional email with proper greeting, clear paragraphs, and appropriate closing: {text}
```

**Creative Writing:**

```text
Enhance the following rough draft into engaging narrative prose with vivid descriptions and smooth transitions while preserving the original story elements: {text}
```

#### Tips for Better Results

- **Be specific about format**: "Use markdown headers" vs "organize well"
- **Specify tone**: Professional, casual, academic, creative, etc.
- **Include length guidance**: "Keep it concise" or "provide detailed explanations"
- **Mention special requirements**: "Include timestamps" or "add priority levels"

#### Default Prompts

The plugin comes with optimized default prompts for each format:

- **Notes**: Creates structured content with headers and bullet points
- **Prose**: Generates flowing, well-formatted paragraphs
- **To-Do List**: Produces actionable checkbox items

You can always reset to defaults if needed by clearing the custom prompt field.

### Advanced Settings

- **Max Tokens**: Control response length (affects cost and detail)
- **Model Selection**: Choose optimal model for your use case
- **API Key Management**: Securely store multiple service keys
- **Connection Testing**: Verify API connectivity

## 🔍 Troubleshooting

### Common Issues & Solutions

#### "AI service not configured"

- ✅ Enter a valid API key in settings
- ✅ Test your connection using the "Test" button
- ✅ Ensure billing is enabled for your chosen service

#### "Selected text is too long"

- ✅ Select a smaller portion of text
- ✅ Increase max tokens setting
- ✅ Switch to a model with larger context window

#### "API quota exceeded"

- ✅ Check your usage limits in the service dashboard
- ✅ Add billing information if using free tier
- ✅ Consider upgrading your plan

#### "Rate limit exceeded" (HTTP 429)

- ✅ **Plugin automatically retries** with exponential backoff
- ✅ Wait a few minutes before making more requests
- ✅ Consider upgrading to a higher tier plan
- ✅ Switch to a different AI service temporarily
- ✅ Make sure you api key is valid
- ✅ **New**: Built-in rate limiting prevents most rate limit errors

### Debug Mode

Enable browser developer tools (F12) to see detailed error information and API call logs.

### Getting Help

1. **Check the error message** - they now provide specific guidance
2. **Test your API key** directly in the service's web interface
3. **Review the troubleshooting guide** in the plugin documentation
4. **Check service status pages** for outages
5. **Report issues** with full error details if problems persist

## 🔒 Privacy & Security

- **🏠 Local Storage**: All API keys stored locally in your Obsidian vault
- **🚫 No Data Collection**: Plugin doesn't collect or store any user data
- **🔗 Direct API Calls**: Text sent directly to your chosen AI service
- **🛡️ No Intermediary Servers**: No third-party servers process your content
- **🔐 Secure Key Storage**: API keys encrypted using Obsidian's secure storage

## 💰 Cost Information

Usage costs vary by AI service and model selection. Each service offers different pricing tiers.

_Check current pricing on each service's website for the most up-to-date information._

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/jayarerita/obsidian-ai-text-formatter.git
cd obsidian-ai-text-formatter

# Install dependencies
npm install

# Build the plugin
npm run build

# For development with hot reload
npm run dev
```

### Running Tests

The plugin includes basic test coverage to ensure core functionality works correctly.

```bash
# Run basic tests
npm test

# Run tests with coverage
npx jest --coverage

# Run specific test file
npx jest tests/basic.test.ts
```

### Test Coverage

Current test coverage includes:

- **Core Types**: Validation of enums and default settings
- **Prompt Builder**: Testing prompt generation and validation
- **Basic Functionality**: Core plugin functionality tests

The test suite is designed to be lightweight and focused on critical functionality to ensure the plugin works reliably in the Obsidian environment.

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type checking
npx tsc --noEmit --skipLibCheck
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **🐛 Issues**: Report bugs on [GitHub Issues](https://github.com/jayarerita/obsidian-ai-text-formatter/issues)

## 📈 Changelog

See [RELEASE_NOTES.md](RELEASE_NOTES.md) for detailed version history and changes.

## 🙏 Acknowledgments

- Thanks to the Obsidian team for the excellent plugin API
- Thanks to OpenAI, Google, and Anthropic for their powerful AI services
- Thanks to the Obsidian community for feedback and testing
- Special thanks to all contributors and supporters

---

**⚠️ Note**: This plugin requires API keys from third-party AI services. Usage costs depend on your chosen service and usage patterns. Please review pricing for your selected AI service. Most services offer generous free tiers for getting started.

**🎯 Perfect for**: Voice-to-text cleanup, meeting notes, brainstorming sessions, rough draft improvement, and any text that needs professional formatting!

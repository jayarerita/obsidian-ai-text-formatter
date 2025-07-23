# Contributing to AI Text Formatter

Thank you for your interest in contributing to the AI Text Formatter plugin! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git
- Obsidian (for testing)
- TypeScript knowledge

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/obsidian-ai-text-formatter.git
   cd obsidian-ai-text-formatter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Build**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 🛠️ Development Workflow

### Code Style

- **TypeScript**: Use strict TypeScript with proper typing
- **ESLint**: Follow the existing ESLint configuration
- **Formatting**: Use consistent formatting (2 spaces, semicolons)
- **Comments**: Add JSDoc comments for public methods

### Testing

- Write tests for new features
- Ensure all tests pass before submitting
- Aim for good test coverage on critical paths
- Use the existing test patterns and mocking

### Commit Messages

Use conventional commit format:
```
type(scope): description

feat(ai-service): add support for new AI model
fix(error-handler): improve rate limit handling
docs(readme): update installation instructions
test(prompts): add validation tests
```

## 📝 Types of Contributions

### 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Obsidian version and OS
- Plugin version
- Error messages or logs

### ✨ Feature Requests

For new features, please:
- Check existing issues first
- Describe the use case clearly
- Explain why it would be valuable
- Consider implementation complexity

### 🔧 Code Contributions

#### Areas for Contribution

1. **New AI Services**: Add support for additional AI providers
2. **Format Types**: Create new text formatting options
3. **UI Improvements**: Enhance the settings interface
4. **Error Handling**: Improve error messages and recovery
5. **Performance**: Optimize API calls and processing
6. **Testing**: Expand test coverage
7. **Documentation**: Improve guides and examples

#### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Thoroughly**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Submit Pull Request**
   - Clear title and description
   - Reference related issues
   - Include testing instructions

## 🏗️ Architecture Guidelines

### File Organization

```
├── ai-services/          # AI service implementations
├── ui/                   # User interface components
├── utils/                # Utility functions
├── tests/                # Test files
├── docs/                 # Documentation
└── main.ts              # Plugin entry point
```

### Design Principles

- **Single Responsibility**: Each class/function has one clear purpose
- **Dependency Injection**: Use constructor injection for dependencies
- **Error Handling**: Comprehensive error handling with user feedback
- **Type Safety**: Strict TypeScript with proper interfaces
- **Testability**: Design for easy testing and mocking

### Adding New AI Services

1. **Extend BaseAIService**
   ```typescript
   export class NewAIService extends BaseAIService {
     async generateText(prompt: string): Promise<AIResponse> {
       // Implementation
     }
   }
   ```

2. **Update Service Factory**
   ```typescript
   case AIService.NEW_SERVICE:
     return new NewAIService(apiKey, maxTokens);
   ```

3. **Add to Types**
   ```typescript
   enum AIService {
     NEW_SERVICE = "new-service"
   }
   ```

4. **Update Settings UI**
   - Add API key input
   - Add model selection
   - Add connection testing

## 🧪 Testing Guidelines

### Test Structure

```typescript
describe('Component Name', () => {
  describe('Feature Group', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

### What to Test

- **Core Functionality**: Main plugin features
- **Error Scenarios**: Edge cases and error handling
- **Validation**: Input validation and API key checking
- **Integration**: Component interactions

### Mocking

- Use existing mocks for Obsidian API
- Mock external API calls
- Keep tests isolated and fast

## 📚 Documentation

### Code Documentation

- JSDoc comments for public methods
- Inline comments for complex logic
- README updates for new features
- Type definitions with descriptions

### User Documentation

- Update README for new features
- Add troubleshooting entries
- Include usage examples
- Update model selection guide

## 🔒 Security Considerations

- **API Keys**: Never log or expose API keys
- **Input Validation**: Validate all user inputs
- **Error Messages**: Don't leak sensitive information
- **Dependencies**: Keep dependencies updated

## 🚀 Release Process

1. **Version Bump**: Update version in manifest.json and package.json
2. **Changelog**: Update RELEASE_NOTES.md
3. **Testing**: Full regression testing
4. **Build**: Create production build
5. **Tag**: Create git tag for release

### Automated Github Release Creation

1. Update version in manifest.json and package.json
2. Update RELEASE_NOTES.md with changes
3. Commit changes

```bash
git add .
git commit -m "Prepare release v1.2.0"
```

4. Create and push tag

```bash
git tag v1.2.0
git push origin v1.2.0
```

5. Action runs automatically to create a release draft
6. Go to GitHub releases and publish the draft


## 💬 Community

- **Issues**: Use GitHub Issues for bugs and features
- **Code Review**: All PRs require review
- **Be Respectful**: Follow the code of conduct

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- GitHub contributors list

Thank you for helping make AI Text Formatter better! 🎉
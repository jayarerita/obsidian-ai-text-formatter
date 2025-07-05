# Testing Guide

This document provides information about the testing setup for the AI Text Formatter plugin.

## Test Structure

The plugin includes focused tests for critical functionality:

### Test Files

- **`tests/basic.test.ts`** - Core types, constants, and prompt builder functionality
- **`tests/error-handler.test.ts`** - Error handling, validation, and user feedback
- **`tests/service-factory.test.ts`** - AI service creation and API key validation

### Test Coverage

Current test coverage focuses on the most critical components:

| Component | Coverage | Focus |
|-----------|----------|-------|
| Types & Constants | 100% | Core enums and default settings |
| Prompt Builder | 87.5% | Text formatting prompts |
| Error Handler | 65.4% | Error classification and validation |
| Service Factory | 88.5% | API key validation and service creation |

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

### Individual Test Files

```bash
# Run specific test file
npx jest tests/basic.test.ts
npx jest tests/error-handler.test.ts
npx jest tests/service-factory.test.ts
```

## Test Configuration

### Jest Configuration

The project uses Jest with TypeScript support:

- **Environment**: jsdom (for DOM-related testing)
- **Transform**: ts-jest for TypeScript files
- **Mocking**: Obsidian API is mocked for testing
- **Coverage**: Comprehensive coverage reporting

### Key Configuration Files

- `jest.config.js` - Jest configuration
- `tests/setup.ts` - Test environment setup
- `tests/__mocks__/obsidian.ts` - Obsidian API mocks

## CI/CD Integration

### GitHub Actions

The project includes automated testing via GitHub Actions:

- **Workflow**: `.github/workflows/test.yml`
- **Triggers**: Push to main/develop, Pull requests
- **Matrix**: Tests run on Node.js 18.x and 20.x
- **Coverage**: Results uploaded to Codecov

### Build Verification

Tests are integrated with the build process:

1. **Test Phase**: All tests must pass
2. **Build Phase**: Plugin must build successfully
3. **Artifact Check**: Build outputs are verified

## Test Philosophy

### Focus Areas

The test suite prioritizes:

1. **Core Functionality**: Essential plugin features
2. **Error Handling**: User-facing error scenarios
3. **Validation**: Input validation and API key checking
4. **Type Safety**: TypeScript type definitions

### Lightweight Approach

Tests are designed to be:

- **Fast**: Quick execution for rapid feedback
- **Focused**: Testing critical paths and edge cases
- **Maintainable**: Easy to update as code evolves
- **Reliable**: Consistent results across environments

## Adding New Tests

### Guidelines

When adding new tests:

1. **Test Critical Paths**: Focus on user-facing functionality
2. **Mock External Dependencies**: Use mocks for Obsidian API and AI services
3. **Test Error Scenarios**: Include both success and failure cases
4. **Keep Tests Simple**: One concept per test case

### Example Test Structure

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

## Troubleshooting

### Common Issues

1. **TypeScript Warnings**: Add `esModuleInterop: true` to tsconfig.json if needed
2. **Mock Issues**: Ensure Obsidian API is properly mocked
3. **Timeout Issues**: Increase Jest timeout for slow tests
4. **Coverage Issues**: Check file paths in Jest configuration

### Debug Mode

To debug tests:

```bash
# Run with verbose output
npx jest --verbose

# Run specific test with debugging
npx jest tests/basic.test.ts --verbose --no-cache
```

## Future Improvements

### Potential Enhancements

- **Integration Tests**: Test component interactions
- **E2E Tests**: Full workflow testing
- **Performance Tests**: Response time validation
- **Visual Tests**: UI component testing

### Coverage Goals

- Maintain >60% coverage on utility functions
- Add tests for new features
- Focus on user-facing functionality
- Test error scenarios comprehensively

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing](https://jestjs.io/docs/getting-started#using-typescript)
- [Obsidian Plugin Development](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)

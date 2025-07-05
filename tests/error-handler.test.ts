import { ErrorHandler, ErrorType } from '../utils/error-handler';

// Mock Obsidian Notice
jest.mock('obsidian', () => ({
  Notice: jest.fn()
}));

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Classification', () => {
    test('should classify configuration errors', () => {
      const errorInfo = ErrorHandler.handleError('API key not configured');
      expect(errorInfo.type).toBe(ErrorType.CONFIGURATION);
      expect(errorInfo.recoverable).toBe(true);
    });

    test('should classify network errors', () => {
      const errorInfo = ErrorHandler.handleError('Network request failed');
      expect(errorInfo.type).toBe(ErrorType.NETWORK);
      expect(errorInfo.recoverable).toBe(true);
    });

    test('should classify API errors', () => {
      const errorInfo = ErrorHandler.handleError('API error occurred');
      expect(errorInfo.type).toBe(ErrorType.API);
      expect(errorInfo.recoverable).toBe(true);
    });

    test('should classify validation errors', () => {
      const errorInfo = ErrorHandler.handleError('No text provided for reformatting');
      expect(errorInfo.type).toBe(ErrorType.VALIDATION);
      expect(errorInfo.recoverable).toBe(true);
    });

    test('should classify processing errors', () => {
      const errorInfo = ErrorHandler.handleError('Something went wrong');
      expect(errorInfo.type).toBe(ErrorType.PROCESSING);
      expect(errorInfo.recoverable).toBe(false);
    });
  });

  describe('API Key Validation', () => {
    test('should validate OpenAI API keys', () => {
      const validKey = ErrorHandler.validateApiKey('openai', 'sk-test123456789');
      expect(validKey.valid).toBe(true);

      const invalidKey = ErrorHandler.validateApiKey('openai', 'invalid-key');
      expect(invalidKey.valid).toBe(false);
      expect(invalidKey.message).toContain('should start with "sk-"');
    });

    test('should validate Claude API keys', () => {
      const validKey = ErrorHandler.validateApiKey('claude', 'sk-ant-test123456789');
      expect(validKey.valid).toBe(true);

      const invalidKey = ErrorHandler.validateApiKey('claude', 'sk-test123');
      expect(invalidKey.valid).toBe(false);
      expect(invalidKey.message).toContain('should start with "sk-ant-"');
    });

    test('should validate Gemini API keys', () => {
      const validKey = ErrorHandler.validateApiKey('gemini', 'AIzaSyTest123456789');
      expect(validKey.valid).toBe(true);

      const shortKey = ErrorHandler.validateApiKey('gemini', 'short');
      expect(shortKey.valid).toBe(false);
      expect(shortKey.message).toContain('too short');
    });

    test('should handle empty API keys', () => {
      const emptyKey = ErrorHandler.validateApiKey('openai', '');
      expect(emptyKey.valid).toBe(false);
      expect(emptyKey.message).toContain('required');
    });
  });

  describe('Text Input Validation', () => {
    test('should validate normal text input', () => {
      const result = ErrorHandler.validateTextInput('This is valid text');
      expect(result.valid).toBe(true);
    });

    test('should reject empty text', () => {
      const emptyResult = ErrorHandler.validateTextInput('');
      expect(emptyResult.valid).toBe(false);
      expect(emptyResult.message).toContain('select some text');

      const whitespaceResult = ErrorHandler.validateTextInput('   ');
      expect(whitespaceResult.valid).toBe(false);
      expect(whitespaceResult.message).toContain('select some text');
    });

    test('should validate text length', () => {
      const longText = 'a'.repeat(15000);
      const result = ErrorHandler.validateTextInput(longText, 10000);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('too long');
    });
  });

  describe('Error Guidance', () => {
    test('should provide appropriate guidance for different error types', () => {
      const configError = ErrorHandler.handleConfigurationError('API key missing');
      const configGuidance = ErrorHandler.getErrorGuidance(configError);
      expect(configGuidance).toContain('Settings');

      const networkError = ErrorHandler.handleNetworkError('Connection failed');
      const networkGuidance = ErrorHandler.getErrorGuidance(networkError);
      expect(networkGuidance).toContain('internet connection');

      const validationError = ErrorHandler.handleValidationError('Text too long');
      const validationGuidance = ErrorHandler.getErrorGuidance(validationError);
      expect(validationGuidance).toContain('input');
    });
  });

  describe('Retryable Error Detection', () => {
    test('should identify retryable errors', () => {
      const networkError = new Error('Network timeout');
      expect(ErrorHandler.isRetryableError(networkError)).toBe(true);

      const rateLimitError = new Error('Rate limit exceeded');
      expect(ErrorHandler.isRetryableError(rateLimitError)).toBe(true);

      const serverError = new Error('Server error 503');
      expect(ErrorHandler.isRetryableError(serverError)).toBe(true);
    });

    test('should identify non-retryable errors', () => {
      const configError = new Error('API key not configured');
      expect(ErrorHandler.isRetryableError(configError)).toBe(false);

      const validationError = new Error('Validation failed');
      expect(ErrorHandler.isRetryableError(validationError)).toBe(false);
    });
  });
});

/**
 * Jest Configuration File
 * 
 * This file configures Jest testing framework for the Node.js Hello World application.
 * It defines the test environment, coverage settings, and other testing options
 * to ensure consistent and thorough testing of the application components.
 */

module.exports = {
  // Use Node.js as the test environment (appropriate for server-side code)
  testEnvironment: 'node',
  
  // Enable verbose output for detailed test results
  verbose: true,
  
  // Files to collect coverage from (includes all JavaScript files except excluded patterns)
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  
  // Coverage thresholds to enforce (requires 80% coverage for merge as per requirements)
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  
  // Pattern to match test files (organized by component in the tests directory)
  testMatch: ['**/tests/**/*.test.js'],
  
  // Patterns to ignore when looking for test files
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Patterns to ignore when collecting coverage statistics
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  
  // Clear mocks between each test to prevent test interference
  clearMocks: true,
  
  // Don't reset mocks between tests (preserve mock implementation)
  resetMocks: false,
  
  // Restore mocked functions to their original implementation after each test
  restoreMocks: true
};
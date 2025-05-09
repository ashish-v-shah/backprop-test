/**
 * Unit tests for the environment configuration module
 * Tests the loading, validation, and access of environment-specific settings
 */

import { config, loadFromEnv, getPort, getHost, getNodeEnv, isDevelopment, isProduction } from '../../../config/environment';
import validatePort from '../../../utils/validatePort';
import logger from '../../../utils/logger';

// Mock the validatePort function and logger
jest.mock('../../../utils/validatePort');
jest.mock('../../../utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
}));

describe('Environment Configuration', () => {
  // Save original environment variables
  const originalEnv = { ...process.env };
  
  beforeEach(() => {
    // Mock logger functions to prevent console output during tests
    jest.clearAllMocks();
    
    // Save original environment variables
    process.env = { ...originalEnv };
    
    // Clear any environment variables that might affect tests
    delete process.env.PORT;
    delete process.env.HOST;
    delete process.env.NODE_ENV;
  });
  
  afterEach(() => {
    // Reset all mocks to their original implementation
    jest.restoreAllMocks();
    
    // Restore original environment variables
    process.env = originalEnv;
  });
  
  test('test_default_config_values', () => {
    // Call loadFromEnv() to load configuration with default values
    loadFromEnv();
    
    // Assert that config has default values
    expect(config.port).toBe(3000);
    expect(config.host).toBe('0.0.0.0');
    expect(config.nodeEnv).toBe('development');
  });
  
  test('test_port_from_environment', () => {
    // Set process.env.PORT to a custom value
    process.env.PORT = '8080';
    
    // Mock validatePort to return a valid port
    validatePort.mockReturnValue(8080);
    
    // Call loadFromEnv() to load configuration from environment
    loadFromEnv();
    
    // Assert that port is loaded from environment variable
    expect(config.port).toBe(8080);
    expect(getPort()).toBe(8080);
  });
  
  test('test_invalid_port_uses_default', () => {
    // Mock validatePort to return undefined (indicating invalid port)
    validatePort.mockReturnValue(undefined);
    
    // Set process.env.PORT to an invalid value
    process.env.PORT = 'abc';
    
    // Call loadFromEnv() to load configuration from environment
    loadFromEnv();
    
    // Assert that default port is used when environment variable is invalid
    expect(config.port).toBe(3000);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid PORT value'));
  });
  
  test('test_host_from_environment', () => {
    // Set process.env.HOST to a custom value
    process.env.HOST = '127.0.0.1';
    
    // Call loadFromEnv() to load configuration from environment
    loadFromEnv();
    
    // Assert that host is loaded from environment variable
    expect(config.host).toBe('127.0.0.1');
    expect(getHost()).toBe('127.0.0.1');
  });
  
  test('test_node_env_from_environment', () => {
    // Set process.env.NODE_ENV to a custom value
    process.env.NODE_ENV = 'production';
    
    // Call loadFromEnv() to load configuration from environment
    loadFromEnv();
    
    // Assert that nodeEnv is loaded from environment variable
    expect(config.nodeEnv).toBe('production');
    expect(getNodeEnv()).toBe('production');
  });
  
  test('test_is_development_function', () => {
    // Set process.env.NODE_ENV to 'development'
    process.env.NODE_ENV = 'development';
    loadFromEnv();
    
    // Assert that isDevelopment() returns true
    expect(isDevelopment()).toBe(true);
    
    // Set process.env.NODE_ENV to 'production'
    process.env.NODE_ENV = 'production';
    loadFromEnv();
    
    // Assert that isDevelopment() returns false
    expect(isDevelopment()).toBe(false);
  });
  
  test('test_is_production_function', () => {
    // Set process.env.NODE_ENV to 'production'
    process.env.NODE_ENV = 'production';
    loadFromEnv();
    
    // Assert that isProduction() returns true
    expect(isProduction()).toBe(true);
    
    // Set process.env.NODE_ENV to 'development'
    process.env.NODE_ENV = 'development';
    loadFromEnv();
    
    // Assert that isProduction() returns false
    expect(isProduction()).toBe(false);
  });
  
  test('test_config_reload', () => {
    // Call loadFromEnv() to load initial configuration
    loadFromEnv();
    
    // Assert that config has default values
    expect(config.port).toBe(3000);
    expect(config.host).toBe('0.0.0.0');
    expect(config.nodeEnv).toBe('development');
    
    // Set environment variables to custom values
    process.env.PORT = '8080';
    process.env.HOST = '127.0.0.1';
    process.env.NODE_ENV = 'production';
    
    // Mock validatePort to return a valid port
    validatePort.mockReturnValue(8080);
    
    // Call loadFromEnv() again to reload configuration
    loadFromEnv();
    
    // Assert that config now has the custom values
    expect(config.port).toBe(8080);
    expect(config.host).toBe('127.0.0.1');
    expect(config.nodeEnv).toBe('production');
    
    // Assert that getter functions return the custom values
    expect(getPort()).toBe(8080);
    expect(getHost()).toBe('127.0.0.1');
    expect(getNodeEnv()).toBe('production');
  });
  
  test('test_port_validation_integration', () => {
    // Mock validatePort to simulate real validation behavior
    validatePort.mockImplementation(port => {
      const parsedPort = parseInt(port, 10);
      if (parsedPort === 8080) return 8080; // Valid port
      return undefined; // Invalid port (like 0 or non-numeric)
    });
    
    // Set process.env.PORT to a valid port number
    process.env.PORT = '8080';
    loadFromEnv();
    
    // Assert that config.port is the valid port
    expect(config.port).toBe(8080);
    
    // Set process.env.PORT to an invalid port number
    process.env.PORT = '0';
    loadFromEnv();
    
    // Assert that config.port is the default port
    expect(config.port).toBe(3000);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid PORT value'));
  });
});
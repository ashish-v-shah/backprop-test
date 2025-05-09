/**
 * Unit tests for the server module that verify the correct initialization,
 * startup, shutdown, and error handling of the HTTP server.
 */

// Import the server module to test
const { startServer, stopServer } = require('../../server');
const app = require('../../app');
const { config } = require('../../config');
const validatePort = require('../../utils/validatePort');
const { logger } = require('../../utils/logger');
const http = require('http'); // built-in v14.x

// Mock dependencies
jest.mock('../../app');
jest.mock('../../config');
jest.mock('../../utils/validatePort');
jest.mock('../../utils/logger');
jest.mock('http');

describe('Server Module', () => {
  let mockServer;
  
  beforeEach(() => {
    // Create mock server with required methods
    mockServer = {
      on: jest.fn().mockImplementation((event, handler) => {
        // Store the error handler for triggering in tests
        if (event === 'error') {
          mockServer.errorHandler = handler;
        }
        return mockServer;
      }),
      listen: jest.fn().mockImplementation((port, host, callback) => {
        if (callback) callback();
        return mockServer;
      }),
      close: jest.fn().mockImplementation((callback) => {
        if (callback) callback();
        return mockServer;
      })
    };
    
    // Mock http.createServer to return our mock server
    http.createServer.mockReturnValue(mockServer);
    
    // Mock config values
    config.port = 3000;
    config.host = '0.0.0.0';
    
    // Mock validatePort to return the input port when valid
    validatePort.mockImplementation(port => port);
    
    // Mock logger functions
    logger.info = jest.fn();
    logger.error = jest.fn();
    logger.logServerStart = jest.fn();
    
    // Mock process.exit to prevent tests from terminating
    process.exit = jest.fn();
  });
  
  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });
  
  test('startServer initializes server with correct port', async () => {
    await startServer();
    
    expect(validatePort).toHaveBeenCalledWith(config.port);
    expect(http.createServer).toHaveBeenCalledWith(app);
    expect(mockServer.listen).toHaveBeenCalledWith(config.port, config.host, expect.any(Function));
    expect(logger.logServerStart).toHaveBeenCalledWith(config.port, config.host);
  });
  
  test('startServer returns server instance', async () => {
    const result = await startServer();
    
    expect(result).toBe(mockServer);
  });
  
  test('startServer handles listen error', async () => {
    const testError = new Error('Test error');
    
    // Setup the mock to trigger the error handler
    mockServer.listen.mockImplementation(() => {
      // Manually trigger the error handler
      mockServer.errorHandler(testError);
      return mockServer;
    });
    
    await expect(startServer()).rejects.toThrow(testError);
    expect(logger.error).toHaveBeenCalled();
  });
  
  test('stopServer closes server gracefully', async () => {
    await stopServer();
    
    expect(mockServer.close).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Server has been shut down');
  });
  
  test('stopServer handles close error', async () => {
    const testError = new Error('Close error');
    
    mockServer.close.mockImplementation((callback) => {
      if (callback) callback(testError);
      return mockServer;
    });
    
    await expect(stopServer()).rejects.toThrow(testError);
    expect(logger.error).toHaveBeenCalledWith('Error shutting down server:', testError);
  });
  
  test('handleServerError logs error and exits', () => {
    const testError = new Error('Server error');
    
    // Create a server instance and trigger the error event
    startServer().catch(() => {});
    mockServer.errorHandler(testError);
    
    expect(logger.error).toHaveBeenCalledWith('Server error: Server error', testError);
  });
  
  test('handleServerError handles EADDRINUSE', () => {
    const testError = new Error('Address in use');
    testError.code = 'EADDRINUSE';
    
    // Create a server instance and trigger the error event
    startServer().catch(() => {});
    mockServer.errorHandler(testError);
    
    expect(logger.error).toHaveBeenCalledWith('Port 3000 is already in use');
  });
  
  test('setupGracefulShutdown registers signal handlers', () => {
    // Save original process.on
    const originalOn = process.on;
    
    // Create a mock for process.on
    const mockOn = jest.fn();
    process.on = mockOn;
    
    // Re-import the server module to trigger setupGracefulShutdown
    jest.isolateModules(() => {
      require('../../server');
    });
    
    // Verify signal handlers were registered
    expect(mockOn).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    
    // Simulate calling the SIGTERM handler
    const sigtermHandler = mockOn.mock.calls.find(call => call[0] === 'SIGTERM')[1];
    sigtermHandler();
    
    // Verify stopServer would be called and process.exit
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('SIGTERM'));
    expect(process.exit).toHaveBeenCalledWith(0);
    
    // Restore original process.on
    process.on = originalOn;
  });
  
  test('server integration with app', async () => {
    // Unmock the app module for this test
    jest.unmock('../../app');
    const realApp = jest.requireActual('../../app');
    
    // Mock http.createServer to verify the app is passed correctly
    http.createServer.mockImplementation((handler) => {
      // The handler should be the real app
      expect(handler).toBe(realApp);
      return mockServer;
    });
    
    // Start the server
    const server = await startServer();
    
    // Verify createServer was called with the app
    expect(http.createServer).toHaveBeenCalledWith(realApp);
    
    // Stop the server
    await stopServer();
    
    // Verify close was called
    expect(mockServer.close).toHaveBeenCalled();
  });
});
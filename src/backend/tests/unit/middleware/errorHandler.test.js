/**
 * Unit tests for the error handling middleware
 * Tests the correct implementation of error handling functions
 * for different error types and ensures they send appropriate HTTP responses
 */

// Import the functions to test
const errorHandler = require('../../../middleware/errorHandler');
const { handleNotFound, handleMethodNotAllowed, handleServerError } = require('../../../middleware/errorHandler');
// Import the logger to mock
const { error, logError } = require('../../../utils/logger');

// Jest is automatically available in the test environment (version ^29.5.0)

describe('Error Handler Middleware', () => {
  // Set up mock request and response objects
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mock request and response objects before each test
    req = {
      method: 'GET',
      url: '/test'
    };
    
    res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn(),
      headersSent: false
    };
    
    next = jest.fn();
    
    // Mock logger functions to prevent console output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn({ error, logError }, 'error').mockImplementation(() => {});
    jest.spyOn({ error, logError }, 'logError').mockImplementation(() => {});
  });

  afterEach(() => {
    // Reset all mocks to their original implementation
    jest.restoreAllMocks();
  });

  test('handleNotFound sets 404 status and appropriate message', () => {
    // Call handleNotFound with mock request and response objects
    handleNotFound(req, res);
    
    // Assert that res.statusCode was set to 404
    expect(res.statusCode).toBe(404);
    
    // Assert that res.setHeader was called with 'Content-Type', 'text/plain'
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert that res.end was called with 'Not Found'
    expect(res.end).toHaveBeenCalledWith('Not Found');
  });

  test('handleMethodNotAllowed sets 405 status, Allow header, and appropriate message', () => {
    // Call handleMethodNotAllowed with mock request, response objects, and 'GET' as allowed method
    handleMethodNotAllowed(req, res, 'GET');
    
    // Assert that res.statusCode was set to 405
    expect(res.statusCode).toBe(405);
    
    // Assert that res.setHeader was called with 'Content-Type', 'text/plain'
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert that res.setHeader was called with 'Allow', 'GET'
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET');
    
    // Assert that res.end was called with 'Method Not Allowed'
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

  test('handleServerError logs the error and sends a generic error response', () => {
    // Create a test error object
    const testError = new Error('Test server error');
    
    // Call handleServerError with the error and mock request and response objects
    handleServerError(testError, req, res);
    
    // Assert that res.statusCode was set to 500
    expect(res.statusCode).toBe(500);
    
    // Assert that res.setHeader was called with 'Content-Type', 'text/plain'
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert that res.end was called with 'Internal Server Error'
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
    
    // Assert that the error details are not exposed in the response
    expect(res.end).not.toHaveBeenCalledWith(testError.message);
  });

  test('errorHandler correctly handles not found errors', () => {
    // Create an error object with status 404 and message containing 'not found'
    const notFoundError = new Error('not found');
    notFoundError.status = 404;
    
    // Call errorHandler with the error and mock request, response, and next objects
    errorHandler(notFoundError, req, res, next);
    
    // Assert that res.statusCode was set to 404
    expect(res.statusCode).toBe(404);
    
    // Assert that res.setHeader was called with 'Content-Type', 'text/plain'
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert that res.end was called with 'Not Found'
    expect(res.end).toHaveBeenCalledWith('Not Found');
  });

  test('errorHandler correctly handles method not allowed errors', () => {
    // Create an error object with status 405, message containing 'method not allowed', and allowedMethods property set to 'GET'
    const methodNotAllowedError = new Error('method not allowed');
    methodNotAllowedError.status = 405;
    methodNotAllowedError.allowedMethods = 'GET';
    
    // Call errorHandler with the error and mock request, response, and next objects
    errorHandler(methodNotAllowedError, req, res, next);
    
    // Assert that res.statusCode was set to 405
    expect(res.statusCode).toBe(405);
    
    // Assert that res.setHeader was called with 'Content-Type', 'text/plain'
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert that res.setHeader was called with 'Allow', 'GET'
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET');
    
    // Assert that res.end was called with 'Method Not Allowed'
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

  test('errorHandler correctly handles generic server errors', () => {
    // Create a generic error object with message 'Test server error'
    const serverError = new Error('Test server error');
    
    // Call errorHandler with the error and mock request, response, and next objects
    errorHandler(serverError, req, res, next);
    
    // Assert that res.statusCode was set to 500
    expect(res.statusCode).toBe(500);
    
    // Assert that res.setHeader was called with 'Content-Type', 'text/plain'
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert that res.end was called with 'Internal Server Error'
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
    
    // Assert that the error details are not exposed in the response
    expect(res.end).not.toHaveBeenCalledWith(serverError.message);
  });

  test('errorHandler uses the status code from the error object', () => {
    // Create an error object with custom status code (e.g., 400)
    const customError = new Error('Custom error');
    customError.status = 400;
    
    // Call errorHandler with the error and mock request, response, and next objects
    errorHandler(customError, req, res, next);
    
    // Assert that res.statusCode was set to the custom status code
    expect(res.statusCode).toBe(400);
  });

  test('errorHandler calls next(err) if headers are already sent', () => {
    // Create a mock response with headersSent property set to true
    res.headersSent = true;
    
    // Create a test error object
    const testError = new Error('Test error');
    
    // Call errorHandler with the error and mock request, response, and next objects
    errorHandler(testError, req, res, next);
    
    // Assert that next was called with the error
    expect(next).toHaveBeenCalledWith(testError);
    
    // Assert that res.status, res.set, and res.send were not called
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });
});
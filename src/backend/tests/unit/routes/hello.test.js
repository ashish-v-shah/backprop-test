/**
 * Unit tests for the hello route module
 * Tests the implementation and behavior of the /hello endpoint handler
 * @module hello.test
 */

// Mock dependencies before importing modules that use them
jest.mock('../../../middleware', () => ({
  handleMethodNotAllowed: jest.fn()
}));

jest.mock('../../../utils/logger', () => ({
  info: jest.fn()
}));

// Import the hello router module to test
const helloRouter = require('../../../routes/hello');

// Import mocked dependencies
const { handleMethodNotAllowed } = require('../../../middleware');
const { info } = require('../../../utils/logger');

// Import testing utilities
const express = require('express'); // v4.18.x
const request = require('supertest'); // v6.3.3

describe('Hello Router', () => {
  // Setup variables for testing
  let req, res, next;

  // Setup before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock request and response objects
    req = {
      method: 'GET',
      url: '/hello'
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
    
    next = jest.fn();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test that the hello router is properly exported
  test('hello router should be defined', () => {
    expect(helloRouter).toBeDefined();
    expect(typeof helloRouter).toBe('function');
    expect(typeof helloRouter.get).toBe('function');
    expect(typeof helloRouter.use).toBe('function');
  });

  // Test that the hello handler returns 'Hello world' with 200 status
  test('hello handler should return Hello world with 200 status', () => {
    // Extract route handler (the middleware in GET / route)
    const routeStack = helloRouter.stack.find(layer => layer.route && layer.route.path === '/');
    const handler = routeStack.route.stack[0].handle;
    
    // Call the handler
    handler(req, res);
    
    // Assert response was set correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.send).toHaveBeenCalledWith('Hello world');
    expect(info).toHaveBeenCalledWith('Request received at /hello endpoint');
  });

  // Test that the hello router validates HTTP method and rejects non-GET requests
  test('hello router should validate HTTP method and reject non-GET requests', () => {
    // Extract method validation middleware (the first middleware in the stack)
    const methodMiddleware = helloRouter.stack.find(layer => !layer.route).handle;
    
    // Test with POST method
    req.method = 'POST';
    methodMiddleware(req, res, next);
    
    // Assert handleMethodNotAllowed was called with correct arguments
    expect(handleMethodNotAllowed).toHaveBeenCalledWith(req, res, 'GET');
    expect(next).not.toHaveBeenCalled();
    
    // Test with other HTTP methods
    const methods = ['PUT', 'DELETE', 'PATCH'];
    methods.forEach(method => {
      jest.clearAllMocks();
      req.method = method;
      methodMiddleware(req, res, next);
      expect(handleMethodNotAllowed).toHaveBeenCalledWith(req, res, 'GET');
      expect(next).not.toHaveBeenCalled();
    });
  });

  // Test that the hello router accepts GET method
  test('hello router should accept GET method and call next middleware', () => {
    // Extract method validation middleware
    const methodMiddleware = helloRouter.stack.find(layer => !layer.route).handle;
    
    // Test with GET method
    req.method = 'GET';
    methodMiddleware(req, res, next);
    
    // Assert next was called and handleMethodNotAllowed was not
    expect(next).toHaveBeenCalled();
    expect(handleMethodNotAllowed).not.toHaveBeenCalled();
  });

  // Test the hello router using supertest for more realistic HTTP request simulation
  test('hello router should handle HTTP requests via supertest', async () => {
    // Create an Express app for testing
    const app = express();
    
    // Mount the hello router
    app.use('/hello', helloRouter);
    
    // Test GET request to /hello
    const getResponse = await request(app)
      .get('/hello')
      .expect(200)
      .expect('Content-Type', 'text/plain');
    
    expect(getResponse.text).toBe('Hello world');
    
    // Test POST request to /hello (should be rejected with 405)
    const postResponse = await request(app)
      .post('/hello')
      .expect(405)
      .expect('Allow', 'GET');
    
    expect(postResponse.text).toBe('Method Not Allowed');
  });
});
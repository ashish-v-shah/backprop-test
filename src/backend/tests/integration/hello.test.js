/**
 * Integration tests for the hello endpoint
 * 
 * Tests the behavior of the /hello endpoint in a running server environment
 * to ensure it meets all requirements specified in the technical specifications.
 * 
 * @module tests/integration/hello
 */

// Import the supertest library for making HTTP requests
const request = require('supertest'); // v6.3.3

// Import the Express application instance
const app = require('../../app');

// Import server functions for starting and stopping the server during tests
const { startServer, stopServer } = require('../../server');

// Server instance for use in tests
let serverInstance;

/**
 * Test suite for the hello endpoint integration tests
 */
describe('Hello Endpoint Integration', () => {
  /**
   * Start the server before running any tests
   */
  beforeAll(async () => {
    // Start the server and store the instance for later shutdown
    serverInstance = await startServer();
  });

  /**
   * Shut down the server after all tests are complete
   */
  afterAll(async () => {
    // Stop the server to clean up resources and ports
    await stopServer(serverInstance);
  });

  /**
   * Tests that GET requests to /hello return 200 status code
   */
  test('GET /hello should return 200 status code', async () => {
    const response = await request(app).get('/hello');
    expect(response.status).toBe(200);
  });

  /**
   * Tests that the hello endpoint returns text/plain content type
   */
  test('GET /hello should return text/plain content type', async () => {
    const response = await request(app).get('/hello');
    expect(response.headers['content-type']).toContain('text/plain');
  });

  /**
   * Tests that the hello endpoint returns 'Hello world' in the response
   */
  test('GET /hello should return "Hello world" in the response', async () => {
    const response = await request(app).get('/hello');
    expect(response.text).toBe('Hello world');
  });

  /**
   * Tests that non-GET requests to /hello return 405 Method Not Allowed
   */
  test('Non-GET requests to /hello should return 405 Method Not Allowed', async () => {
    // Test POST request
    const postResponse = await request(app).post('/hello');
    expect(postResponse.status).toBe(405);
    expect(postResponse.headers.allow).toBe('GET');

    // Test PUT request
    const putResponse = await request(app).put('/hello');
    expect(putResponse.status).toBe(405);
    expect(putResponse.headers.allow).toBe('GET');

    // Test DELETE request
    const deleteResponse = await request(app).delete('/hello');
    expect(deleteResponse.status).toBe(405);
    expect(deleteResponse.headers.allow).toBe('GET');

    // Test PATCH request
    const patchResponse = await request(app).patch('/hello');
    expect(patchResponse.status).toBe(405);
    expect(patchResponse.headers.allow).toBe('GET');
  });

  /**
   * Tests that requests to invalid paths return 404 Not Found
   */
  test('Requests to invalid paths should return 404 Not Found', async () => {
    const response = await request(app).get('/invalid-path');
    expect(response.status).toBe(404);
  });
});
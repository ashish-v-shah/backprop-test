/**
 * Integration tests for the health endpoint of the Node.js Hello World application.
 * 
 * These tests verify that the /health endpoint correctly provides server status,
 * uptime, and environment information, and properly handles different HTTP methods.
 * 
 * @module tests/integration/health
 */

const request = require('supertest'); // v6.3.3
const app = require('../../app');
const { startServer, stopServer } = require('../../server');
const { config } = require('../../config');

// Server instance for tests
let server;

describe('Health Endpoint Integration', () => {
  // Start the server before running tests
  beforeAll(async () => {
    server = await startServer();
    // Short delay to ensure server is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  // Stop the server after tests complete
  afterAll(async () => {
    await stopServer();
    // Short delay to ensure server is fully shut down
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  // Test that health endpoint returns 200 OK status code
  test('should return 200 OK for GET request', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  // Test that health endpoint returns application/json content type
  test('should return application/json content type', async () => {
    const response = await request(app).get('/health');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  // Test that the health endpoint returns status 'up'
  test('should return status "up" in response', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('status', 'up');
  });

  // Test that the health endpoint returns uptime information
  test('should return uptime information', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('string');
    // Uptime should match pattern like "0d 0h 0m 1s" or "1s"
    expect(response.body.uptime).toMatch(/^(\d+d\s+)?(\d+h\s+)?(\d+m\s+)?(\d+s)$/);
  });

  // Test that the health endpoint returns correct environment
  test('should return correct environment information', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('environment');
    expect(response.body.environment).toBe(config.nodeEnv);
  });

  // Test that non-GET methods return 405 Method Not Allowed
  test('should return 405 Method Not Allowed for POST request', async () => {
    const response = await request(app).post('/health');
    expect(response.status).toBe(405);
    expect(response.headers.allow).toBe('GET');
  });

  test('should return 405 Method Not Allowed for PUT request', async () => {
    const response = await request(app).put('/health');
    expect(response.status).toBe(405);
    expect(response.headers.allow).toBe('GET');
  });

  test('should return 405 Method Not Allowed for DELETE request', async () => {
    const response = await request(app).delete('/health');
    expect(response.status).toBe(405);
    expect(response.headers.allow).toBe('GET');
  });

  test('should return 405 Method Not Allowed for PATCH request', async () => {
    const response = await request(app).patch('/health');
    expect(response.status).toBe(405);
    expect(response.headers.allow).toBe('GET');
  });
});
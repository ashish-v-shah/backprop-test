/**
 * Router for handling requests to the /hello endpoint.
 * Implements a simple GET endpoint that returns "Hello world" with appropriate headers.
 * @module hello
 */

// Import dependencies
const express = require('express'); // v4.18.x
const { info } = require('../utils/logger');
const { handleMethodNotAllowed } = require('../middleware');

// Create a new router
const router = express.Router();

/**
 * Validates that the request uses the GET method, otherwise calls the method not allowed handler
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 * @returns {void} No return value, either calls next middleware or sends error response
 */
function validateMethod(req, res, next) {
  if (req.method === 'GET') {
    next();
  } else {
    handleMethodNotAllowed(req, res, 'GET');
  }
}

/**
 * Handles GET requests to the /hello endpoint
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {void} No return value, sends HTTP response
 */
function handleHelloRequest(req, res) {
  // Log that a request to /hello endpoint was received
  info('Request received at /hello endpoint');
  
  // Set response status code to 200
  res.status(200);
  
  // Set Content-Type header to text/plain
  res.setHeader('Content-Type', 'text/plain');
  
  // Send 'Hello world' as the response body
  res.send('Hello world');
}

// Use the validateMethod middleware for all requests to this router
router.use(validateMethod);

// Define the route handler for GET requests
router.get('/', handleHelloRequest);

// Export the router
module.exports = router;
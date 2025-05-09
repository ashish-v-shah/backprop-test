/**
 * Error handling middleware for the Node.js Hello World application.
 * Provides functions to handle different types of errors and sends
 * appropriate HTTP responses with the correct status codes and headers.
 * @module errorHandler
 */

// Import the logger utility
const { error, logError } = require('../utils/logger');

/**
 * Handles 404 Not Found errors by sending an appropriate response
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
function handleNotFound(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}

/**
 * Handles 405 Method Not Allowed errors by sending an appropriate response with allowed methods
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {string} allowedMethods - String containing allowed HTTP methods (e.g., 'GET')
 */
function handleMethodNotAllowed(req, res, allowedMethods) {
  res.statusCode = 405;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Allow', allowedMethods);
  res.end('Method Not Allowed');
}

/**
 * Handles 500 Internal Server Error by logging the error and sending a generic error response
 * @param {Error} err - The error object
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
function handleServerError(err, req, res) {
  logError(err, req);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Internal Server Error');
}

/**
 * Main error handling middleware that processes errors and delegates to specific handlers based on error type
 * @param {Error} err - The error object
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
function errorHandler(err, req, res, next) {
  error(`Error: ${err.message || 'Unknown error'}`, err);
  
  // If response headers are already sent, let the default error handler deal with it
  if (res.headersSent) {
    return next(err);
  }
  
  // Determine the status code
  const statusCode = err.status || err.statusCode || 500;
  
  // Handle different types of errors based on status code, message, or name
  if (statusCode === 404 || err.message === 'Not Found' || err.name === 'NotFoundError') {
    handleNotFound(req, res);
  } else if (statusCode === 405 || err.message === 'Method Not Allowed' || err.name === 'MethodNotAllowedError') {
    handleMethodNotAllowed(req, res, err.allowedMethods || 'GET');
  } else {
    handleServerError(err, req, res);
  }
}

// Export the error handler functions
module.exports = errorHandler;
module.exports.handleNotFound = handleNotFound;
module.exports.handleMethodNotAllowed = handleMethodNotAllowed;
module.exports.handleServerError = handleServerError;
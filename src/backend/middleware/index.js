/**
 * Index file that aggregates and exports all middleware functions for the Node.js Hello World application.
 * This file serves as a central point for importing middleware components throughout the application.
 * @module middleware
 */

// Import error handling middleware functions
const errorHandler = require('./errorHandler');
const { handleNotFound, handleMethodNotAllowed, handleServerError } = require('./errorHandler');

// Import request logging middleware
const requestLogger = require('./requestLogger');

// Export all middleware functions
module.exports = {
  /**
   * Main error handling middleware function for Express-style applications
   */
  errorHandler,
  
  /**
   * Function for handling 404 Not Found errors
   */
  handleNotFound,
  
  /**
   * Function for handling 405 Method Not Allowed errors
   */
  handleMethodNotAllowed,
  
  /**
   * Function for handling 500 Internal Server Error errors
   */
  handleServerError,
  
  /**
   * Middleware function for logging HTTP requests and responses
   */
  requestLogger
};
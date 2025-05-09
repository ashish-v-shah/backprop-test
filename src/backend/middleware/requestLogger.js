/**
 * Middleware for logging HTTP requests and responses in the Node.js Hello World application.
 * It captures request details, measures response time, and logs this information
 * using the application's logger utility.
 * @module requestLogger
 */

// Import the logRequest function from the logger utility
const { logRequest } = require('../utils/logger');

/**
 * Middleware function that logs HTTP request and response details
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 * @param {function} next - The next middleware function in the chain
 * @returns {void} No return value, calls next middleware
 */
function requestLogger(req, res, next) {
  // Record the start time of request processing
  const startTime = Date.now();
  
  // Store the original res.end method
  const originalEnd = res.end;
  
  // Override the res.end method to capture when the response is sent
  res.end = function(chunk, encoding) {
    // Calculate response time in milliseconds
    const responseTime = Date.now() - startTime;
    
    // Log the request and response details
    logRequest(req, res, responseTime);
    
    // Call the original end method with all arguments
    return originalEnd.apply(res, arguments);
  };
  
  // Proceed to the next middleware
  next();
}

// Export the middleware function
module.exports = requestLogger;
/**
 * Central routing module that aggregates and exports all route handlers for the Node.js Hello World application.
 * This module serves as the main entry point for all API routes, combining individual route modules
 * and exporting a configured router for use in the application.
 * 
 * @module routes
 */

// Import dependencies
const express = require('express'); // v4.18.x
const helloRouter = require('./hello');
const healthRouter = require('./health');
const { logger } = require('../utils/logger');
const { handleNotFound } = require('../middleware');

// Create the main router instance
const router = express.Router();

/**
 * Registers all application routes with the main router
 * @param {object} router - The Express router instance
 * @returns {object} The router with all routes registered
 */
function registerRoutes(router) {
  // Register the hello router at path /hello
  router.use('/hello', helloRouter);
  
  // Register the health router at path /health
  router.use('/health', healthRouter);
  
  // Log that all routes have been registered
  logger.info('All application routes have been registered');
  
  // Return the configured router
  return router;
}

/**
 * Sets up the 404 Not Found handler for undefined routes
 * @param {object} router - The Express router instance
 * @returns {object} The router with the not found handler configured
 */
function setupNotFoundHandler(router) {
  // Register the handleNotFound middleware as the last route handler
  router.use('*', handleNotFound);
  
  // Log that the not found handler has been configured
  logger.info('Not found handler has been configured');
  
  // Return the configured router
  return router;
}

// Register all routes
registerRoutes(router);

// Set up the not found handler (should be last)
setupNotFoundHandler(router);

// Export the configured router
module.exports = router;
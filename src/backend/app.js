/**
 * Main Express application module for the Node.js Hello World application.
 * This file configures middleware, routes, and error handlers, serving as
 * the central point for setting up the HTTP server's request handling pipeline.
 * 
 * @module app
 */

// Import dependencies
const express = require('express'); // v4.18.x
const helmet = require('helmet'); // v6.0.x

// Import internal modules
const router = require('./routes');
const { requestLogger, errorHandler } = require('./middleware');
const { logger } = require('./utils/logger');
const { config } = require('./config');

/**
 * Configures application-level middleware for the Express app
 * @param {object} app - The Express application instance
 * @returns {object} The Express app with middleware configured
 */
function configureMiddleware(app) {
  // Add helmet middleware for security headers
  app.use(helmet());
  
  // Add express.json() middleware for parsing JSON request bodies
  app.use(express.json());
  
  // Add requestLogger middleware for logging HTTP requests
  app.use(requestLogger);
  
  // Log that middleware has been configured
  logger.info('Application middleware has been configured');
  
  // Return the configured app
  return app;
}

/**
 * Configures application routes by mounting the main router
 * @param {object} app - The Express application instance
 * @returns {object} The Express app with routes configured
 */
function configureRoutes(app) {
  // Mount the main router at the root path '/'
  app.use('/', router);
  
  // Log that routes have been configured
  logger.info('Application routes have been configured');
  
  // Return the configured app
  return app;
}

/**
 * Configures error handling middleware for the Express app
 * @param {object} app - The Express application instance
 * @returns {object} The Express app with error handling configured
 */
function configureErrorHandling(app) {
  // Add the errorHandler middleware as the last middleware in the chain
  app.use(errorHandler);
  
  // Log that error handling has been configured
  logger.info('Application error handling has been configured');
  
  // Return the configured app
  return app;
}

/**
 * Creates and configures the Express application
 * @returns {object} The fully configured Express application
 */
function createApp() {
  // Create a new Express application instance
  const app = express();
  
  // Configure middleware
  configureMiddleware(app);
  
  // Configure routes
  configureRoutes(app);
  
  // Configure error handling
  configureErrorHandling(app);
  
  // Log that the application has been created and configured
  logger.info(`Application created and configured in ${config.nodeEnv} environment`);
  
  // Return the fully configured app
  return app;
}

// Create and configure the Express application
const app = createApp();

// Export the configured app
module.exports = app;
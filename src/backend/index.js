/**
 * Entry point for the Node.js Hello World application
 * 
 * This module initializes the configuration, starts the HTTP server,
 * and sets up graceful shutdown handling.
 * 
 * @module index
 */

// Import internal modules
const { startServer, stopServer } = require('./server');
const { initializeConfig } = require('./config');
const logger = require('./utils/logger');

// Global server instance
let server;

/**
 * Sets up event listeners for process signals to enable graceful shutdown of the server
 */
function setupGracefulShutdown() {
  // Handle SIGTERM signal (e.g., kill command)
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: shutting down...');
    try {
      await stopServer();
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Handle SIGINT signal (e.g., Ctrl+C)
  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: shutting down...');
    try {
      await stopServer();
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
}

/**
 * Global handler for uncaught exceptions to prevent the application from crashing unexpectedly
 * 
 * @param {Error} error - The uncaught exception
 */
function handleUncaughtException(error) {
  logger.error('Uncaught exception:', error);
  
  // Attempt to gracefully shut down the server
  stopServer()
    .finally(() => {
      process.exit(1);
    });
}

/**
 * Global handler for unhandled promise rejections to prevent silent failures
 * 
 * @param {Error} reason - The rejection reason
 * @param {Promise} promise - The promise that was rejected
 */
function handleUnhandledRejection(reason, promise) {
  logger.error('Unhandled promise rejection:', reason);
  
  // Attempt to gracefully shut down the server
  stopServer()
    .finally(() => {
      process.exit(1);
    });
}

/**
 * Main function that bootstraps the application by initializing configuration and starting the server
 * 
 * @returns {Promise<void>} Promise that resolves when the server has started successfully
 */
async function main() {
  try {
    // Initialize the logger
    logger.setLogLevel();
    
    // Log application startup
    logger.info('Starting Node.js Hello World application...');
    
    // Initialize configuration
    initializeConfig();
    
    // Set up graceful shutdown handlers
    setupGracefulShutdown();
    
    // Set up global error handlers
    process.on('uncaughtException', handleUncaughtException);
    process.on('unhandledRejection', handleUnhandledRejection);
    
    // Start the HTTP server
    server = await startServer();
    
    // Log successful startup
    logger.info('Application started successfully');
    
    return server;
  } catch (err) {
    logger.error('Failed to start application:', err);
    process.exit(1);
  }
}

// Execute the main function
main().catch(err => {
  logger.error('Unexpected error during startup:', err);
  process.exit(1);
});
/**
 * Configuration Module
 * 
 * Serves as the central point for configuration management in the Node.js Hello World application.
 * Exports environment-specific configuration settings and utility functions for accessing these settings.
 * 
 * @module config
 */

import {
  loadFromEnv,
  getPort,
  getHost,
  getNodeEnv,
  isDevelopment,
  isProduction,
  config
} from './environment';

/**
 * Initializes the configuration by loading values from environment variables.
 * 
 * @returns {object} The initialized configuration object
 */
function initializeConfig() {
  // Load configuration from environment variables
  return loadFromEnv();
}

// Export configuration functions and objects
export {
  config,
  loadFromEnv,
  getPort,
  getHost,
  getNodeEnv,
  isDevelopment,
  isProduction,
  initializeConfig
};
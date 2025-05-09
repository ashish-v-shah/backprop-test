/**
 * Environment Configuration Module
 * 
 * Manages environment-specific configuration settings for the Node.js Hello World application.
 * Loads values from environment variables with sensible defaults and provides access functions.
 * 
 * @module environment
 */

import validatePort from '../utils/validatePort';
import logger from '../utils/logger';
const { info, debug } = logger;

// Default configuration values
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_NODE_ENV = 'development';

// Initialize configuration with defaults
let config = {
  port: DEFAULT_PORT,
  host: DEFAULT_HOST,
  nodeEnv: DEFAULT_NODE_ENV
};

/**
 * Loads configuration values from environment variables with fallbacks to defaults.
 * Validates critical values like port number.
 * 
 * @returns {object} Updated configuration object with values from environment variables or defaults
 */
function loadFromEnv() {
  // Get port from environment or use default
  const envPort = process.env.PORT;
  let port = DEFAULT_PORT;
  
  if (envPort) {
    // Validate the port number is in valid range
    const validatedPort = validatePort(envPort);
    if (validatedPort) {
      port = validatedPort;
    } else {
      info(`Invalid PORT value: ${envPort}, using default: ${DEFAULT_PORT}`);
    }
  }
  
  // Get host from environment or use default
  const host = process.env.HOST || DEFAULT_HOST;
  
  // Get Node.js environment or use default
  const nodeEnv = process.env.NODE_ENV || DEFAULT_NODE_ENV;
  
  // Update the configuration object
  config = {
    port,
    host,
    nodeEnv
  };
  
  // Log the configuration at debug level
  debug(`Configuration loaded: port=${port}, host=${host}, nodeEnv=${nodeEnv}`);
  
  return config;
}

/**
 * Returns the configured port number.
 * 
 * @returns {number} The configured port number
 */
function getPort() {
  return config.port;
}

/**
 * Returns the configured host address.
 * 
 * @returns {string} The configured host address
 */
function getHost() {
  return config.host;
}

/**
 * Returns the configured Node.js environment.
 * 
 * @returns {string} The configured Node.js environment (development, production, etc.)
 */
function getNodeEnv() {
  return config.nodeEnv;
}

/**
 * Checks if the current environment is development.
 * 
 * @returns {boolean} True if the environment is development, false otherwise
 */
function isDevelopment() {
  return getNodeEnv() === 'development';
}

/**
 * Checks if the current environment is production.
 * 
 * @returns {boolean} True if the environment is production, false otherwise
 */
function isProduction() {
  return getNodeEnv() === 'production';
}

// Load configuration from environment variables on initial import
loadFromEnv();

export {
  config,
  loadFromEnv,
  getPort,
  getHost,
  getNodeEnv,
  isDevelopment,
  isProduction
};
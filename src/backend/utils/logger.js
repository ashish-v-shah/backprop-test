/**
 * Logger utility for the Node.js Hello World application
 * Provides different log levels and specialized logging functions
 * @module logger
 */

// Define log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Default log level (can be overridden by environment variable)
let currentLogLevel = LOG_LEVELS.INFO;

/**
 * Formats the current date and time as a timestamp string
 * @returns {string} Formatted timestamp string (YYYY-MM-DD HH:MM:SS)
 */
function formatTimestamp() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a log message with timestamp and level prefix
 * @param {string} level - The log level
 * @param {string} message - The message to log
 * @returns {string} Formatted log message with timestamp and level
 */
function formatLogMessage(level, message) {
  const timestamp = formatTimestamp();
  return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Sets the current log level based on environment variable or default
 * @returns {number} The current log level
 */
function setLogLevel() {
  const envLogLevel = process.env.LOG_LEVEL;
  
  if (envLogLevel) {
    const upperLogLevel = envLogLevel.toUpperCase();
    if (LOG_LEVELS[upperLogLevel] !== undefined) {
      currentLogLevel = LOG_LEVELS[upperLogLevel];
    }
  }
  
  return currentLogLevel;
}

/**
 * Determines if a message at the given level should be logged based on current log level
 * @param {number} level - The level of the message
 * @returns {boolean} True if the message should be logged, false otherwise
 */
function shouldLog(level) {
  return level <= currentLogLevel;
}

/**
 * Logs a debug-level message to the console
 * @param {string} message - The message to log
 */
function debug(message) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    console.log(formatLogMessage('DEBUG', message));
  }
}

/**
 * Logs an info-level message to the console
 * @param {string} message - The message to log
 */
function info(message) {
  if (shouldLog(LOG_LEVELS.INFO)) {
    console.log(formatLogMessage('INFO', message));
  }
}

/**
 * Logs a warning-level message to the console
 * @param {string} message - The message to log
 */
function warn(message) {
  if (shouldLog(LOG_LEVELS.WARN)) {
    console.warn(formatLogMessage('WARN', message));
  }
}

/**
 * Logs an error-level message to the console
 * @param {string} message - The message to log
 * @param {Error} [error] - Optional error object to log stack trace
 */
function error(message, error) {
  // Always log errors regardless of log level setting
  console.error(formatLogMessage('ERROR', message));
  if (error && error.stack) {
    console.error(error.stack);
  }
}

/**
 * Logs server startup information including port and host
 * @param {number} port - The port number the server is running on
 * @param {string} [host] - The host the server is running on
 */
function logServerStart(port, host) {
  info(`Server running at http://${host || '0.0.0.0'}:${port}`);
}

/**
 * Logs information about an HTTP request and its response
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {number} [responseTime] - The time taken to process the request in milliseconds
 */
function logRequest(req, res, responseTime) {
  const method = req.method;
  const url = req.url;
  const statusCode = res.statusCode;
  
  let logMsg = `${method} ${url} ${statusCode}`;
  if (responseTime !== undefined) {
    logMsg += ` ${responseTime}ms`;
  }
  
  info(logMsg);
}

/**
 * Logs detailed information about an error including request context
 * @param {Error} err - The error object
 * @param {object} [req] - Optional request object for context
 */
function logError(err, req) {
  let message = 'Server error';
  
  if (req) {
    const method = req.method;
    const url = req.url;
    message = `Error processing request: ${method} ${url}`;
  }
  
  error(message, err);
}

// Initialize log level from environment variables
setLogLevel();

// Export the logger object
const logger = {
  debug,
  info,
  warn,
  error,
  logServerStart,
  logRequest,
  logError,
  setLogLevel
};

module.exports = logger;
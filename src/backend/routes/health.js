/**
 * Health Check Route Module
 * 
 * Implements a health check endpoint that provides information about the server's
 * operational status, uptime, and environment. This allows monitoring systems to
 * verify the service is running correctly.
 *
 * @module routes/health
 */

import express from 'express'; // express v4.18.x
import logger from '../utils/logger';
import { config } from '../config';

const { debug } = logger;

// Router instance for the health endpoint
const router = express.Router();

// Track server start time for uptime calculation
const startTime = new Date();

/**
 * Formats the server uptime into a human-readable string
 * 
 * @returns {string} Formatted uptime string (e.g., '1d 2h 3m 4s')
 */
function formatUptime() {
  const now = new Date();
  const uptimeMs = now - startTime;
  
  // Convert to seconds, minutes, hours, days
  const seconds = Math.floor((uptimeMs / 1000) % 60);
  const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
  const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
  
  // Format the uptime string
  const formattedUptime = [];
  if (days > 0) formattedUptime.push(`${days}d`);
  if (hours > 0) formattedUptime.push(`${hours}h`);
  if (minutes > 0) formattedUptime.push(`${minutes}m`);
  formattedUptime.push(`${seconds}s`);
  
  return formattedUptime.join(' ');
}

/**
 * Generates the health status information for the server
 * 
 * @returns {object} Health status object with status, uptime, and environment information
 */
function getHealthStatus() {
  return {
    status: 'up',
    uptime: formatUptime(),
    environment: config.nodeEnv
  };
}

/**
 * Handles GET requests to the /health endpoint
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function handleHealthRequest(req, res) {
  debug('Health check request received');
  
  const healthStatus = getHealthStatus();
  
  res.status(200).json(healthStatus);
  
  debug('Health check response sent');
}

/**
 * Handles non-GET requests to the /health endpoint
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function handleMethodNotAllowed(req, res) {
  debug(`Method not allowed: ${req.method} /health`);
  
  res.status(405)
    .set('Allow', 'GET')
    .send('Method Not Allowed');
  
  debug('Method not allowed response sent');
}

// Set up the route handlers
router.get('/health', handleHealthRequest);

// Handle other methods to the /health endpoint
router.all('/health', handleMethodNotAllowed);

// Export the router
export { router };
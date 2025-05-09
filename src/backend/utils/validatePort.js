/**
 * Constants representing the valid port range for TCP/IP networking
 * MIN_PORT = 1: The lowest possible TCP/IP port number
 * MAX_PORT = 65535: The highest possible TCP/IP port number
 */
const MIN_PORT = 1;
const MAX_PORT = 65535;

/**
 * Validates that a given port number is within the valid range for TCP/IP networking.
 * This function ensures port values are valid before attempting to start a server.
 * 
 * @param {any} port - The port value to validate, can be a string or number
 * @returns {number|undefined} - The validated port number if valid, or undefined if invalid
 */
function validatePort(port) {
  // Convert port to a number (base 10)
  const parsedPort = parseInt(port, 10);
  
  // Check if parsedPort is not a number (NaN)
  if (isNaN(parsedPort)) {
    return undefined;
  }
  
  // Check if port is outside the valid range
  if (parsedPort < MIN_PORT || parsedPort > MAX_PORT) {
    return undefined;
  }
  
  // Port is valid, return the parsed number
  return parsedPort;
}

export default validatePort;
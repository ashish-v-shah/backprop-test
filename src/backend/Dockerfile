# Use Node.js 18 Alpine as the base image for a lightweight container
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better layer caching
# This allows Docker to cache the dependency installation step
# if package files haven't changed
COPY package*.json ./

# Install production dependencies only to minimize image size
RUN npm install --production

# Copy application code
# This is done after dependency installation to leverage Docker layer caching
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Install wget for health check and set proper permissions
# Combined into a single RUN command to reduce layers
RUN apk add --no-cache wget && \
    chown -R node:node /app

# Switch to non-root user for security
USER node

# Add health check to allow Docker to monitor container health
# Checks the /health endpoint every 30 seconds
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

# Command to start the application
CMD ["node", "server.js"]
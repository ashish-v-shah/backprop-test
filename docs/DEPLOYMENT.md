# Deployment Guide for Node.js Hello World Application

## Introduction

This document provides comprehensive deployment instructions for the Node.js Hello World application. It covers various deployment options, environment configuration, and operational procedures to help you successfully deploy and maintain the application in different environments.

## Prerequisites

Before deploying the Node.js Hello World application, ensure you have the following prerequisites:

- Node.js 18.x LTS or higher installed
- npm 8.x or higher installed
- Git for version control (optional)
- Docker and Docker Compose for containerized deployment (optional)
- Access to a server or cloud environment for production deployment (optional)
- Basic understanding of command-line operations

## Environment Configuration

The application can be configured using the following environment variables:

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| PORT | 3000 | TCP port on which the server listens | `PORT=8080` |
| NODE_ENV | development | Execution environment (development/production) | `NODE_ENV=production` |
| LOG_LEVEL | info | Logging verbosity (error/warn/info/debug) | `LOG_LEVEL=debug` |
| HOST | 0.0.0.0 | Host address to bind server | `HOST=127.0.0.1` |

These variables can be set in the environment before starting the application, or provided in a `.env` file (using the included `.env.example` as a template).

## Deployment Options

### Local Development Deployment

For local development and testing:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   cd src/backend
   npm install
   ```

3. Start the development server (with auto-reload):
   ```bash
   npm run dev
   ```

4. Alternatively, start the server without auto-reload:
   ```bash
   npm start
   ```

5. The server will be available at http://localhost:3000/hello

### Production Deployment with Process Manager

For improved reliability in production, use a process manager like PM2:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Navigate to the application directory:
   ```bash
   cd src/backend
   ```

3. Start the application with PM2:
   ```bash
   pm2 start server.js --name "hello-world" --env production
   ```

4. Configure PM2 to start on system boot:
   ```bash
   pm2 startup
   pm2 save
   ```

5. Monitor the application:
   ```bash
   pm2 status
   pm2 logs hello-world
   ```

6. Restart the application after updates:
   ```bash
   pm2 restart hello-world
   ```

### Docker Container Deployment

For containerized deployment using Docker:

1. Build the Docker image:
   ```bash
   cd src/backend
   docker build -t node-hello-world .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:3000 --name hello-world node-hello-world
   ```

3. Check container status:
   ```bash
   docker ps
   docker logs hello-world
   ```

4. Stop and remove the container:
   ```bash
   docker stop hello-world
   docker rm hello-world
   ```

Alternatively, use Docker Compose for a more declarative approach:

1. Navigate to the infrastructure directory:
   ```bash
   cd infrastructure
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Check logs:
   ```bash
   docker-compose logs
   ```

4. Stop the application:
   ```bash
   docker-compose down
   ```

### Cloud Deployment with Terraform

For automated cloud deployment using Terraform:

1. Install Terraform:
   - Follow the [official installation guide](https://learn.hashicorp.com/tutorials/terraform/install-cli)

2. Configure AWS credentials (if using AWS):
   - Set up AWS CLI credentials or environment variables

3. Navigate to the Terraform directory:
   ```bash
   cd infrastructure/terraform
   ```

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Review the deployment plan:
   ```bash
   terraform plan
   ```

6. Apply the configuration to create resources:
   ```bash
   terraform apply
   ```

7. Access the application URL from the Terraform outputs:
   ```bash
   terraform output app_url
   ```

8. To destroy the resources when no longer needed:
   ```bash
   terraform destroy
   ```

### Serverless Deployment

For serverless deployment (e.g., AWS Lambda):

1. Modify the application to work with serverless handlers (not included in this repository)

2. Package the application for serverless deployment

3. Deploy using the serverless platform's tools or frameworks like Serverless Framework or AWS SAM

Note: Detailed serverless deployment instructions are beyond the scope of this basic application but could be implemented for more advanced use cases.

## Testing the Deployment

After deploying the application, verify it's working correctly:

1. Test the hello endpoint:
   ```bash
   curl http://<server-address>:<port>/hello
   ```
   Expected response: `Hello world`

2. Test the health endpoint:
   ```bash
   curl http://<server-address>:<port>/health
   ```
   Expected response: JSON with status information

3. Verify logging is working by checking the logs:
   - For local deployment: Check the console output
   - For PM2: `pm2 logs hello-world`
   - For Docker: `docker logs hello-world`
   - For cloud deployment: Check the cloud provider's logging service

## Environment-Specific Configurations

### Development Environment

Recommended configuration for development:

```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
HOST=localhost
```

This configuration provides:
- Detailed logging for debugging
- Local-only access for security
- Development-specific behaviors

### Production Environment

Recommended configuration for production:

```bash
PORT=3000 # Or as required by your infrastructure
NODE_ENV=production
LOG_LEVEL=info
HOST=0.0.0.0 # Or specific IP if needed
```

This configuration provides:
- Appropriate logging level for production
- Production optimizations
- Ability to bind to all network interfaces (or specific ones if needed)

### Testing Environment

Recommended configuration for testing:

```bash
PORT=3001 # Different from development to avoid conflicts
NODE_ENV=test
LOG_LEVEL=warn
HOST=localhost
```

This configuration provides:
- Minimal logging during test execution
- Test-specific behaviors
- Isolation from development environment

## Scaling Considerations

While this is a simple application designed for educational purposes, here are some scaling considerations for higher loads:

1. **Horizontal Scaling**:
   - Run multiple instances behind a load balancer
   - For Docker: Scale with `docker-compose up -d --scale node-hello-world=3`
   - For cloud: Use auto-scaling groups or Kubernetes

2. **Vertical Scaling**:
   - Increase resources (CPU/memory) allocated to the application
   - For Docker: Update resource limits in Docker Compose file
   - For cloud: Choose larger instance types

3. **Performance Optimization**:
   - Enable compression for responses
   - Implement caching if needed
   - Use a reverse proxy like Nginx for SSL termination and static file serving

## Monitoring and Logging

To effectively monitor the application:

1. **Health Checks**:
   - Use the `/health` endpoint to verify the application is running
   - Configure external monitoring tools to periodically check this endpoint

2. **Logging**:
   - In production, consider redirecting logs to a file or logging service
   - For Docker: Use logging drivers to send logs to appropriate destinations
   - For cloud: Use cloud-native logging services

3. **Metrics (if implemented)**:
   - Monitor request counts, response times, and error rates
   - Use monitoring tools like Prometheus and Grafana for visualization

4. **Alerts**:
   - Set up alerts for application downtime
   - Configure notifications for error rate spikes
   - Monitor resource utilization (CPU, memory)

## Maintenance Procedures

Regular maintenance helps keep the application secure and performing well:

1. **Dependency Updates** (Monthly):
   ```bash
   cd src/backend
   npm outdated # Check for outdated dependencies
   npm update   # Update dependencies within version constraints
   npm audit    # Check for security vulnerabilities
   npm audit fix # Fix security vulnerabilities
   ```

2. **Node.js Updates** (Quarterly):
   - Update to the latest LTS version of Node.js
   - Test thoroughly after updates

3. **Log Review** (Weekly):
   - Review logs for errors and unusual patterns
   - Address recurring issues

4. **Performance Check** (Monthly):
   - Verify response times remain acceptable
   - Check resource utilization

5. **Backup Procedures**:
   - Ensure source code is backed up in version control
   - Document configuration for quick recovery

## Troubleshooting

Common issues and their solutions:

1. **Application Won't Start**:
   - Check if the port is already in use: `lsof -i :3000`
   - Verify Node.js version: `node --version`
   - Check for syntax errors in the code
   - Verify all dependencies are installed: `npm install`

2. **Port Already in Use**:
   - Change the port using the PORT environment variable
   - Kill the process using the port: `kill $(lsof -t -i:3000)`

3. **Docker Container Exits Immediately**:
   - Check container logs: `docker logs hello-world`
   - Verify the Dockerfile has the correct CMD
   - Check for errors in the application code

4. **High Memory Usage**:
   - Check for memory leaks
   - Adjust container memory limits
   - Consider implementing garbage collection tuning

5. **Slow Response Times**:
   - Check system resource utilization
   - Verify network latency
   - Consider scaling the application

## Security Considerations

Security considerations for deployment:

1. **Environment Variables**:
   - Never commit sensitive environment variables to version control
   - Use environment-specific configuration files or secrets management

2. **Network Security**:
   - Restrict access to the server using firewalls
   - Consider using a reverse proxy for additional security layers
   - Use HTTPS in production environments

3. **Container Security**:
   - Use the latest base images with security patches
   - Run containers with minimal privileges
   - Scan container images for vulnerabilities

4. **Regular Updates**:
   - Keep dependencies updated to patch security vulnerabilities
   - Apply security patches promptly

5. **Access Control**:
   - Limit SSH access to production servers
   - Use key-based authentication instead of passwords
   - Implement the principle of least privilege

## Backup and Recovery

Backup and recovery procedures:

1. **Source Code Backup**:
   - Maintain the codebase in a version control system (Git)
   - Consider mirroring the repository to multiple locations

2. **Configuration Backup**:
   - Document all environment variables and configuration settings
   - Store configuration templates in version control
   - Keep sensitive configuration separate and secured

3. **Recovery Procedures**:
   - Document step-by-step recovery procedures
   - Regularly test recovery procedures
   - Maintain deployment scripts for quick redeployment

4. **Disaster Recovery**:
   - Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective)
   - Document procedures for different failure scenarios
   - Consider multi-region deployment for critical applications

## Conclusion

This deployment guide provides comprehensive instructions for deploying, configuring, and maintaining the Node.js Hello World application across various environments. While the application itself is simple by design, these deployment practices establish a foundation of good operational procedures that can be applied to more complex applications.

For additional information, refer to:
- [Architecture Documentation](./ARCHITECTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [README](../README.md)
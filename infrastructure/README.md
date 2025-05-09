# Node.js Hello World - Infrastructure

This directory contains infrastructure configurations for deploying the Node.js Hello World application in various environments. The application is a simple HTTP server that exposes a `/hello` endpoint returning "Hello world" to clients.

## Deployment Options

The Node.js Hello World application can be deployed using several approaches, each with different complexity and benefits:

1. **Direct Execution**: Running the Node.js application directly
2. **Process Manager**: Using PM2 or similar for improved reliability
3. **Docker Container**: Using containerization for consistency and isolation
4. **Cloud Deployment**: Using Terraform to provision cloud infrastructure

This directory provides configurations for the containerized and cloud deployment options.

## Prerequisites

Depending on your chosen deployment method, you'll need the following tools installed:

### For Docker Deployment
- Docker Engine (20.10 or later)
- Docker Compose (2.0 or later)

### For Terraform/AWS Deployment
- Terraform (1.2.0 or later)
- AWS CLI (2.0 or later)
- AWS account with appropriate permissions
- SSH key pair for EC2 access

### Verifying Prerequisites

```bash
# Check Docker version
docker --version
docker-compose --version

# Check Terraform version
terraform --version

# Check AWS CLI version
aws --version
```

## Resource Requirements

The Node.js Hello World application has minimal resource requirements:

| Resource | Minimal | Recommended | Purpose |
|----------|---------|-------------|---------|
| CPU | 0.1 vCPU | 0.5 vCPU | Process HTTP requests |
| Memory | 128MB | 256MB | Node.js runtime and application |
| Disk | 50MB | 100MB | Application code and logs |
| Network | 1 Mbps | 10 Mbps | Handle HTTP traffic |

These requirements are reflected in the Docker Compose and Terraform configurations.

## Docker Deployment

The `docker-compose.yml` file in this directory provides a containerized deployment configuration for the Node.js Hello World application.

### Configuration Overview

The Docker Compose configuration:
- Builds the application container from the Dockerfile in `src/backend`
- Maps port 3000 from the container to the host
- Sets environment variables for the application
- Configures health checks and restart policies
- Sets resource constraints

### Deployment Steps

1. **Build and start the container**:
   ```bash
   docker-compose up -d
   ```

2. **Verify the container is running**:
   ```bash
   docker-compose ps
   ```

3. **Check container logs**:
   ```bash
   docker-compose logs
   ```

4. **Access the application**:
   - Hello endpoint: http://localhost:3000/hello
   - Health endpoint: http://localhost:3000/health

5. **Stop the container**:
   ```bash
   docker-compose down
   ```

### Environment Variables

The following environment variables can be modified in the `docker-compose.yml` file:

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | The port on which the server listens |
| NODE_ENV | production | The Node.js environment |
| HOST | 0.0.0.0 | The host address to bind to |
| LOG_LEVEL | info | The logging verbosity level |

## Terraform/AWS Deployment

The `terraform` directory contains configurations for deploying the application to AWS using Terraform.

### Configuration Overview

The Terraform configuration:
- Creates a VPC, subnet, and security group
- Provisions an EC2 instance
- Installs Docker and runs the application container
- Configures security and networking

For detailed information, refer to the [Terraform README](./terraform/README.md).

### Deployment Steps

1. **Navigate to the Terraform directory**:
   ```bash
   cd terraform
   ```

2. **Initialize Terraform**:
   ```bash
   terraform init
   ```

3. **Create a deployment plan**:
   ```bash
   terraform plan -out=tfplan
   ```

4. **Apply the plan to create resources**:
   ```bash
   terraform apply tfplan
   ```

5. **Access the application**:
   After deployment, Terraform will output:
   - The public IP address of the EC2 instance
   - The URL to access the Hello World application
   - The SSH command to connect to the instance

6. **Destroy resources when no longer needed**:
   ```bash
   terraform destroy
   ```

### Customization

You can customize the deployment by creating a `terraform.tfvars` file with your preferred settings. See the [Terraform README](./terraform/README.md) for available variables.

## Monitoring and Observability

The Node.js Hello World application includes a `/health` endpoint that can be used for basic monitoring.

### Docker Deployment Monitoring

- **Container Health**: The Docker Compose configuration includes a health check
- **Container Logs**: Access logs with `docker-compose logs`
- **Container Stats**: Monitor resource usage with `docker stats`

### AWS Deployment Monitoring

- **EC2 Metrics**: Available through AWS CloudWatch
- **Application Health**: The `/health` endpoint can be monitored with AWS Route 53 Health Checks
- **Logs**: Available through SSH access to the EC2 instance

### Setting Up External Monitoring

For production deployments, consider setting up:
- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- Log aggregation (e.g., CloudWatch Logs, ELK Stack)
- Performance monitoring (e.g., New Relic, Datadog)

## Security Considerations

While the Node.js Hello World application is minimal, consider these security practices:

### Docker Deployment

- Keep Docker and container images updated
- Use non-root users in containers
- Scan images for vulnerabilities
- Limit container capabilities

### AWS Deployment

- Restrict SSH access to specific IP ranges
- Use security groups to limit network access
- Keep the EC2 instance updated
- Consider using HTTPS with a load balancer

### General Security

- The application sets security headers through Helmet middleware
- Error handling is designed to avoid information disclosure
- Input validation is implemented for request parameters

## Cost Considerations

### Docker Deployment

Running the application locally with Docker has no direct cloud costs, only the cost of running your local machine.

### AWS Deployment

The default Terraform configuration uses the following billable AWS resources:

| Resource | Estimated Monthly Cost (USD) |
|----------|------------------------------|
| EC2 t2.micro | $8-10 |
| EBS Volume (8 GB) | $0.80 |
| Data Transfer | Varies based on usage |

Total estimated cost: **$10-15 per month**

### Cost Optimization

- Destroy resources when not in use
- Consider using Spot Instances for non-critical workloads
- Monitor and optimize resource usage
- For educational purposes, stay within the AWS Free Tier when possible

## Troubleshooting

### Docker Deployment Issues

1. **Container fails to start**
   - Check Docker logs: `docker-compose logs`
   - Verify port 3000 is not already in use
   - Ensure Docker has sufficient resources

2. **Application not accessible**
   - Verify container is running: `docker-compose ps`
   - Check container health: `docker inspect node-hello-world`
   - Ensure host firewall allows access to port 3000

### AWS Deployment Issues

1. **Terraform errors**
   - Verify AWS credentials are configured correctly
   - Check for sufficient AWS permissions
   - Review Terraform logs for specific error messages

2. **EC2 instance not accessible**
   - Verify security group allows traffic on ports 22 (SSH) and 3000 (HTTP)
   - Check if the instance is running in the AWS Console
   - Verify the SSH key pair is correct

3. **Application not responding**
   - SSH into the instance to check Docker status
   - View application logs: `docker logs node-hello-world`
   - Verify the application is running on the correct port

## Maintenance Procedures

### Docker Deployment

1. **Updating the application**
   ```bash
   # Pull latest code changes
   git pull
   
   # Rebuild and restart containers
   docker-compose down
   docker-compose up -d --build
   ```

2. **Updating Docker images**
   ```bash
   # Update base images
   docker pull node:18-alpine
   
   # Rebuild application container
   docker-compose build --no-cache
   docker-compose up -d
   ```

### AWS Deployment

1. **Updating the application**
   - Update the code in your repository
   - Re-run the Terraform apply process
   - Alternatively, SSH into the instance and update the container manually

2. **Updating the EC2 instance**
   ```bash
   # SSH into the instance
   ssh -i your-key.pem ubuntu@instance-ip
   
   # Update the system
   sudo apt update
   sudo apt upgrade -y
   
   # Restart the application container
   docker restart node-hello-world
   ```

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Terraform Documentation](https://www.terraform.io/docs/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
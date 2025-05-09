# Node.js Hello World - Terraform Deployment

This directory contains Terraform configurations for deploying the Node.js Hello World application to AWS. The deployment creates a VPC, subnet, security group, and EC2 instance that runs the application in a Docker container.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed and configured:

- Terraform (version 1.2.0 or later)
- AWS CLI (version 2.0 or later)
- AWS account with appropriate permissions
- SSH key pair created in your AWS account

### Verifying Prerequisites

```bash
# Check Terraform version
terraform --version

# Check AWS CLI version
aws --version

# Verify AWS credentials are configured
aws sts get-caller-identity
```

## Configuration Overview

The Terraform configuration consists of the following files:

- `main.tf`: Defines the AWS provider and resources (VPC, subnet, security group, EC2 instance)
- `variables.tf`: Declares input variables that can be customized
- `outputs.tf`: Defines output values displayed after deployment

### Resources Created

| Resource | Purpose |
|----------|----------|
| VPC | Isolated network environment for the application |
| Subnet | Network segment within the VPC |
| Internet Gateway | Enables communication between VPC and internet |
| Route Table | Directs traffic from the subnet to the internet |
| Security Group | Controls inbound/outbound traffic for the EC2 instance |
| EC2 Instance | Hosts the Node.js Hello World application |

### EC2 Instance Configuration

The EC2 instance is configured with:
- Ubuntu 20.04 LTS AMI
- User data script that installs Docker and runs the application
- Security group allowing SSH (port 22) and application traffic (port 3000 by default)
- 8GB root volume

## Customization Options

You can customize the deployment by modifying the following variables:

| Variable | Default | Description |
|----------|---------|-------------|
| region | us-west-2 | AWS region where resources will be deployed |
| instance_type | t2.micro | EC2 instance type for the application server |
| ssh_key_name | (Required) | Name of the SSH key pair for EC2 instance access |
| app_port | 3000 | Port on which the Node.js Hello World application will listen |

### Setting Variables

You can set these variables in several ways:

1. **Command line flags**:
   ```bash
   terraform apply -var="region=us-east-1" -var="instance_type=t3.micro"
   ```

2. **Environment variables**:
   ```bash
   export TF_VAR_region=us-east-1
   export TF_VAR_instance_type=t3.micro
   ```

3. **Variable definitions file** (recommended):
   Create a file named `terraform.tfvars` with the following content:
   ```hcl
   region = "us-east-1"
   instance_type = "t3.micro"
   ssh_key_name = "your-key-name"
   app_port = 8080
   ```

## Deployment Steps

Follow these steps to deploy the application to AWS:

1. **Initialize Terraform**:
   ```bash
   terraform init
   ```
   This downloads the required providers and initializes the working directory.

2. **Create a deployment plan**:
   ```bash
   terraform plan -out=tfplan
   ```
   This shows what resources will be created and allows you to verify the configuration.

3. **Apply the plan to create resources**:
   ```bash
   terraform apply tfplan
   ```
   This creates the AWS resources defined in the configuration.

4. **Access the application**:
   After deployment completes, Terraform will output:
   - The public IP address of the EC2 instance
   - The URL to access the Hello World application
   - The SSH command to connect to the instance
   - The health check URL

   Example output:
   ```
   instance_public_ip = "54.123.45.67"
   app_url = "http://54.123.45.67:3000/hello"
   ssh_connection = "ssh -i <path-to-private-key> ubuntu@54.123.45.67"
   health_check_url = "http://54.123.45.67:3000/health"
   ```

5. **Verify the deployment**:
   - Open the app_url in a web browser to see "Hello world"
   - Check the health_check_url to verify the application is running properly
   - Use the ssh_connection command to connect to the instance (replace <path-to-private-key> with your actual key path)

## Managing the Deployment

### Viewing Deployment State

```bash
# Show current state
terraform show

# List resources
terraform state list
```

### Making Changes

To modify the deployment:

1. Update the Terraform configuration or variables
2. Run `terraform plan` to see the changes
3. Run `terraform apply` to apply the changes

### Destroying Resources

When you no longer need the resources, destroy them to avoid ongoing charges:

```bash
terraform destroy
```

Confirm the destruction when prompted.

## Monitoring and Maintenance

### Monitoring the Application

- **Health Check**: The application exposes a `/health` endpoint at http://<instance-ip>:3000/health
- **AWS CloudWatch**: The EC2 instance metrics are available in CloudWatch
- **Logs**: SSH into the instance and use `docker logs node-hello-world` to view application logs

### Updating the Application

To update the application:

1. SSH into the EC2 instance:
   ```bash
   ssh -i <path-to-private-key> ubuntu@<instance-ip>
   ```

2. Pull and run the latest version of the container:
   ```bash
   docker pull node:18-alpine
   docker restart node-hello-world
   ```

Alternatively, update the Terraform configuration and re-apply to replace the instance.

## Security Considerations

The Terraform configuration implements several security best practices:

- **VPC Isolation**: The application runs in a dedicated VPC
- **Security Groups**: Inbound traffic is restricted to SSH and application ports only
- **SSH Key Authentication**: Access to the EC2 instance requires an SSH key

### Security Enhancements

For production deployments, consider these additional security measures:

1. **Restrict SSH Access**: Modify the security group to allow SSH only from specific IP ranges
2. **Implement HTTPS**: Add an Application Load Balancer with SSL/TLS certificate
3. **Use Private Subnets**: Place the EC2 instance in a private subnet with a NAT gateway
4. **Enable VPC Flow Logs**: Monitor network traffic for security analysis
5. **Implement AWS WAF**: Add web application firewall protection

## Cost Considerations

The default configuration uses the following billable AWS resources:

| Resource | Estimated Monthly Cost (USD) |
|----------|------------------------------|
| EC2 t2.micro | $8-10 |
| EBS Volume (8 GB) | $0.80 |
| Data Transfer | Varies based on usage |

Total estimated cost: **$10-15 per month**

### Cost Optimization

- **Use the AWS Free Tier**: t2.micro instances are eligible for the AWS Free Tier for 12 months
- **Destroy when not in use**: Run `terraform destroy` when you don't need the resources
- **Consider Spot Instances**: Modify the configuration to use Spot Instances for significant savings
- **Resize resources**: Adjust the instance type based on actual usage patterns

## Troubleshooting

### Common Issues

1. **Terraform initialization fails**
   - Verify internet connectivity
   - Check Terraform version compatibility
   - Clear the `.terraform` directory and try again

2. **AWS provider authentication fails**
   - Verify AWS credentials are configured correctly
   - Check IAM permissions
   - Try using a different authentication method

3. **Resource creation fails**
   - Check for resource name conflicts
   - Verify service quotas and limits
   - Review error messages in the Terraform output

4. **EC2 instance not accessible**
   - Verify security group allows traffic on ports 22 and 3000
   - Check if the instance is running in the AWS Console
   - Verify the SSH key pair is correct

5. **Application not responding**
   - SSH into the instance to check Docker status
   - View application logs: `docker logs node-hello-world`
   - Check user data script execution in `/var/log/cloud-init-output.log`

## References

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
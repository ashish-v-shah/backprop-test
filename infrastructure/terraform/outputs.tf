# Node.js Hello World Application - Terraform Outputs
# These outputs provide essential information after successful infrastructure deployment

# Public IP address of the EC2 instance
output "instance_public_ip" {
  value       = aws_instance.node_hello_world_instance.public_ip
  description = "Public IP address of the EC2 instance"
}

# Complete URL to access the Hello World endpoint
output "app_url" {
  value       = "http://${aws_instance.node_hello_world_instance.public_ip}:${var.app_port}/hello"
  description = "URL to access the Hello World application"
}

# SSH command for connecting to the EC2 instance
output "ssh_connection" {
  value       = "ssh -i <path-to-private-key> ubuntu@${aws_instance.node_hello_world_instance.public_ip}"
  description = "SSH command to connect to the EC2 instance"
}

# Health check URL for monitoring application status
output "health_check_url" {
  value       = "http://${aws_instance.node_hello_world_instance.public_ip}:${var.app_port}/health"
  description = "URL for the application health check endpoint"
}
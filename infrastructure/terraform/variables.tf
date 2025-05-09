# AWS Region configuration
variable "region" {
  description = "AWS region where resources will be deployed"
  type        = string
  default     = "us-west-2"
}

# EC2 instance type configuration
variable "instance_type" {
  description = "EC2 instance type for the application server"
  type        = string
  default     = "t2.micro"
}

# SSH key pair configuration for secure instance access
variable "ssh_key_name" {
  description = "Name of the SSH key pair for EC2 instance access"
  type        = string
}

# Application port configuration
variable "app_port" {
  description = "Port on which the Node.js Hello World application will listen"
  type        = number
  default     = 3000
  
  validation {
    condition     = var.app_port > 0 && var.app_port < 65536
    error_message = "The app_port must be a valid port number between 1 and 65535."
  }
}
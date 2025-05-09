# Define required providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}

# AWS provider configuration
provider "aws" {
  region = var.region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# VPC and networking
resource "aws_vpc" "node_hello_world_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "node-hello-world-vpc"
  }
}

resource "aws_subnet" "node_hello_world_subnet" {
  vpc_id                  = aws_vpc.node_hello_world_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[0]
  
  tags = {
    Name = "node-hello-world-subnet"
  }
}

resource "aws_internet_gateway" "node_hello_world_igw" {
  vpc_id = aws_vpc.node_hello_world_vpc.id
  
  tags = {
    Name = "node-hello-world-igw"
  }
}

resource "aws_route_table" "node_hello_world_route_table" {
  vpc_id = aws_vpc.node_hello_world_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.node_hello_world_igw.id
  }
  
  tags = {
    Name = "node-hello-world-route-table"
  }
}

resource "aws_route_table_association" "node_hello_world_route_table_assoc" {
  subnet_id      = aws_subnet.node_hello_world_subnet.id
  route_table_id = aws_route_table.node_hello_world_route_table.id
}

# Security group
resource "aws_security_group" "node_hello_world_sg" {
  name        = "node-hello-world-sg"
  description = "Allow HTTP and SSH traffic"
  vpc_id      = aws_vpc.node_hello_world_vpc.id
  
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "Application HTTP access"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "node-hello-world-sg"
  }
}

# EC2 instance
resource "aws_instance" "node_hello_world_instance" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  key_name                    = var.ssh_key_name
  subnet_id                   = aws_subnet.node_hello_world_subnet.id
  vpc_security_group_ids      = [aws_security_group.node_hello_world_sg.id]
  user_data                   = file("${path.module}/scripts/setup.sh")
  user_data_replace_on_change = true
  
  root_block_device {
    volume_size           = 8
    volume_type           = "gp2"
    delete_on_termination = true
  }
  
  tags = {
    Name = "node-hello-world-instance"
  }
}

# Local variables for script substitution
locals {
  setup_script_vars = {
    app_port = var.app_port
  }
}
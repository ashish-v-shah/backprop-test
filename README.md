# Node.js Hello World

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients. This project serves as a minimal, functional example of a Node.js web service that can be used as a learning tool or starter template.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Development](#development)
- [Documentation](#documentation)
- [License](#license)

## Overview

This project demonstrates a minimal Node.js HTTP server implementation that follows best practices for structure, error handling, and configuration. It's designed to be simple enough for beginners to understand while incorporating patterns that scale to more complex applications.

The application exposes a `/hello` endpoint that returns "Hello world" and a `/health` endpoint for monitoring the service status.

## Features

- HTTP server implementation using Node.js
- Single REST endpoint (`/hello`) returning "Hello world" text response
- Health check endpoint (`/health`) for monitoring
- Environment variable configuration
- Basic error handling with appropriate HTTP status codes
- Request logging
- Security headers
- Docker containerization support
- Terraform infrastructure as code

## Quick Start

### Prerequisites

- Node.js 18.x LTS or higher
- npm 8.x or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
cd src/backend
npm install
```

### Running the Application

```bash
# Start the server
npm start

# The server will be available at:
# http://localhost:3000/hello
```

### Using Docker

```bash
# Build and run with Docker
cd src/backend
docker build -t node-hello-world .
docker run -p 3000:3000 node-hello-world

# Or use Docker Compose from the root directory
cd infrastructure
docker-compose up -d
```

## API Documentation

### GET /hello

Returns "Hello world" with a 200 OK status.

**Request:**
- Method: GET
- Path: /hello

**Response:**
- Status Code: 200 OK
- Content-Type: text/plain
- Body: Hello world

**Error Responses:**
- 405 Method Not Allowed (if using non-GET method)
  - Headers: Allow: GET

### GET /health

Returns server health information with a 200 OK status.

**Request:**
- Method: GET
- Path: /health

**Response:**
- Status Code: 200 OK
- Content-Type: application/json
- Body: `{ "status": "up", "uptime": "1d 2h 3m 4s", "environment": "development" }`

**Error Responses:**
- 405 Method Not Allowed (if using non-GET method)
  - Headers: Allow: GET

## Project Structure

```
├── docs/                # Documentation files
│   ├── ARCHITECTURE.md  # Architecture documentation
│   ├── CONTRIBUTING.md  # Contribution guidelines
│   ├── DEPLOYMENT.md    # Deployment instructions
│   └── README.md        # Documentation index
├── infrastructure/      # Infrastructure configuration
│   ├── docker-compose.yml # Docker Compose configuration
│   ├── terraform/       # Terraform IaC for cloud deployment
│   └── README.md        # Infrastructure documentation
├── src/                 # Source code
│   └── backend/         # Backend application code
│       ├── config/      # Configuration management
│       ├── middleware/  # Express middleware
│       ├── routes/      # API routes
│       ├── tests/       # Test files
│       ├── utils/       # Utility functions
│       ├── app.js       # Express application setup
│       ├── server.js    # HTTP server initialization
│       └── index.js     # Application entry point
├── .github/             # GitHub configuration files
├── .gitignore           # Git ignore file
├── LICENSE              # Project license
└── README.md            # This file
```

## Configuration

The application can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | TCP port on which the server listens |
| `HOST` | `0.0.0.0` | Host address to bind the server |
| `NODE_ENV` | `development` | Execution environment |
| `LOG_LEVEL` | `info` | Logging verbosity level |

You can set these variables in a `.env` file or directly when running the application:

```bash
PORT=8080 npm start
```

A sample `.env.example` file is provided in the `src/backend` directory.

## Deployment

The application can be deployed using several approaches:

1. **Direct Execution**: Running the Node.js application directly
2. **Process Manager**: Using PM2 or similar for improved reliability
3. **Docker Container**: Using containerization for consistency and isolation
4. **Cloud Deployment**: Using Terraform to provision cloud infrastructure

For detailed deployment instructions, see the [Deployment Guide](./docs/DEPLOYMENT.md) and [Infrastructure Documentation](./infrastructure/README.md).

## Development

### Running in Development Mode

The development mode uses nodemon to automatically restart the server when files change:

```bash
cd src/backend
npm run dev
```

### Testing

The application includes unit and integration tests:

```bash
cd src/backend

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate test coverage report
npm run test:coverage
```

### Linting

This project uses ESLint for code quality:

```bash
cd src/backend

# Check code style
npm run lint

# Fix code style issues automatically
npm run lint:fix
```

## Documentation

Comprehensive documentation is available throughout the project:

- [Architecture Documentation](./docs/ARCHITECTURE.md) - System design and component details
- [Deployment Guide](./docs/DEPLOYMENT.md) - Detailed deployment instructions
- [Backend Documentation](./src/backend/README.md) - Backend-specific documentation
- [Infrastructure Documentation](./infrastructure/README.md) - Infrastructure and deployment configuration
- [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) - Contribution guidelines

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
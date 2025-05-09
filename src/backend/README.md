# Node.js Hello World Backend

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients. This backend service demonstrates the fundamentals of creating a Node.js web service with minimal complexity.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Features

- HTTP server implementation using Node.js
- Single REST endpoint (`/hello`) returning "Hello world" text response
- Health check endpoint (`/health`) for monitoring
- Environment variable configuration
- Basic error handling with appropriate HTTP status codes
- Request logging
- Security headers via Helmet
- Cross-Origin Resource Sharing (CORS) support

## Requirements

- Node.js 18.x LTS or higher
- npm 8.x or higher

## Installation

1. Navigate to the backend directory:
```bash
cd src/backend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The server can be configured using environment variables:

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

A sample `.env.example` file is provided in the repository. Copy it to create your own configuration:

```bash
cp .env.example .env
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

Once the server is running, you can access the endpoints:

- Hello endpoint: `http://localhost:3000/hello`
- Health check: `http://localhost:3000/health`

Example using curl:

```bash
curl http://localhost:3000/hello
# Output: Hello world

curl http://localhost:3000/health
# Output: {"status":"up","uptime":"0d 0h 0m 5s","environment":"development"}
```

## API Endpoints

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

### Error Responses

**404 Not Found**
- Returned when requesting a non-existent endpoint
- Content-Type: text/plain
- Body: Not Found

**405 Method Not Allowed**
- Returned when using an unsupported HTTP method on an existing endpoint
- Content-Type: text/plain
- Headers: Allow: [allowed methods]
- Body: Method Not Allowed

**500 Internal Server Error**
- Returned when an unexpected error occurs on the server
- Content-Type: text/plain
- Body: Internal Server Error

## Development

### Running in Development Mode

The development mode uses nodemon to automatically restart the server when files change:

```bash
npm run dev
```

### Linting

This project uses ESLint for code quality. Run linting with:

```bash
# Check code style
npm run lint

# Fix code style issues automatically
npm run lint:fix
```

## Testing

The backend includes unit and integration tests using Jest and Supertest.

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate test coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

Test files are located in the `tests` directory, organized into `unit` and `integration` subdirectories.

## Project Structure

```
├── config/           # Configuration management
│   ├── environment.js # Environment variable loading
│   └── index.js      # Configuration exports
├── middleware/       # Express middleware
│   ├── errorHandler.js # Error handling middleware
│   ├── index.js      # Middleware exports
│   └── requestLogger.js # Request logging middleware
├── routes/           # API routes
│   ├── health.js     # Health check endpoint
│   ├── hello.js      # Hello world endpoint
│   └── index.js      # Routes configuration
├── tests/            # Test files
│   ├── integration/  # Integration tests
│   └── unit/         # Unit tests
├── utils/            # Utility functions
│   ├── logger.js     # Logging utility
│   └── validatePort.js # Port validation utility
├── .dockerignore     # Docker ignore file
├── .env.example      # Example environment variables
├── .eslintrc.js      # ESLint configuration
├── app.js            # Express application setup
├── Dockerfile        # Docker configuration
├── index.js          # Application entry point
├── jest.config.js    # Jest test configuration
├── nodemon.json      # Nodemon configuration
├── package.json      # Project dependencies and scripts
├── package-lock.json # Locked dependencies
├── README.md         # This file
├── server.js         # HTTP server initialization
└── tsconfig.json     # TypeScript configuration (if used)
```

## Troubleshooting

### Common Issues

**Port already in use**

If you see an error like `Error: listen EADDRINUSE :::3000`, it means the port is already being used by another application. You can:

1. Stop the other application using that port
2. Use a different port by setting the PORT environment variable:
   ```bash
   PORT=3001 npm start
   ```

**Module not found errors**

If you encounter module not found errors, ensure you've installed all dependencies:

```bash
npm install
```

**Permission denied errors**

If you encounter permission issues when starting the server, ensure you have the necessary permissions to bind to the specified port, especially if using a port below 1024.
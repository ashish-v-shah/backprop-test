# Contributing to Node.js Hello World

Thank you for your interest in contributing to the Node.js Hello World application! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Documentation Contributions](#documentation-contributions)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Getting Started

### Project Overview

The Node.js Hello World application is a simple HTTP server that exposes a `/hello` endpoint returning "Hello world" to clients. It serves as a minimal, functional example of a Node.js web service that can be used as a learning tool or starter template.

### Repository Structure

```
├── .github/            # GitHub workflows and templates
├── docs/               # Project documentation
│   ├── ARCHITECTURE.md # Architecture documentation
│   ├── CONTRIBUTING.md # This file
│   ├── DEPLOYMENT.md   # Deployment instructions
│   └── README.md       # Documentation index
├── infrastructure/     # Infrastructure as code
│   ├── docker-compose.yml
│   └── terraform/      # Terraform configurations
├── src/                # Source code
│   └── backend/        # Backend application
│       ├── config/     # Configuration management
│       ├── middleware/ # Express middleware
│       ├── routes/     # API routes
│       ├── tests/      # Test files
│       ├── utils/      # Utility functions
│       ├── app.js      # Express application setup
│       └── server.js   # HTTP server initialization
└── README.md           # Main README file
```

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x LTS or higher
- npm 8.x or higher
- Git 2.x or higher

## Development Environment Setup

### Fork and Clone the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/node-hello-world.git
   cd node-hello-world
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/node-hello-world.git
   ```

### Install Dependencies

```bash
cd src/backend
npm install
```

### Running the Application

```bash
# Start the server
npm start

# Start with auto-reload for development
npm run dev
```

### Recommended Development Tools

- **Editor**: Visual Studio Code with the following extensions:
  - ESLint
  - Prettier
  - EditorConfig
- **API Testing**: Postman or curl for testing endpoints
- **Version Control**: Git with GitHub Desktop or command line

## Coding Standards

This project follows strict coding standards to maintain code quality and consistency. All code must adhere to these standards before it will be accepted.

### JavaScript Style Guide

We use ESLint to enforce our coding standards. The configuration can be found in `src/backend/.eslintrc.js`. Key style rules include:

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons at the end of statements
- Use Unix line endings (LF)
- Maximum line length of 100 characters
- Use const for variables that don't change
- Always use strict equality (===)
- Use curly braces for all control statements
- Use consistent spacing in objects and arrays

### Running the Linter

```bash
# Check code style
npm run lint

# Fix automatically fixable issues
npm run lint:fix
```

### Code Organization

- Keep files focused on a single responsibility
- Group related functionality in the same directory
- Use descriptive file and function names
- Export only what is necessary from modules
- Document complex logic with comments

### Error Handling

- Use try/catch blocks for error-prone operations
- Propagate errors up to where they can be properly handled
- Use appropriate HTTP status codes for API responses
- Log errors with sufficient context for debugging

## Testing Requirements

All code contributions must include appropriate tests. This project uses Jest for testing, with a minimum required coverage threshold of 80% for statements, branches, functions, and lines.

### Test Organization

Tests are organized in the `src/backend/tests` directory:

```
tests/
├── unit/           # Unit tests for individual components
│   ├── config/     # Tests for configuration modules
│   ├── middleware/ # Tests for middleware functions
│   ├── routes/     # Tests for route handlers
│   └── utils/      # Tests for utility functions
└── integration/    # Integration tests for API endpoints
```

### Writing Tests

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API endpoints with supertest
- **Test Naming**: Use descriptive names that explain what is being tested
- **Test Structure**: Follow the Arrange-Act-Assert pattern

Example test structure:

```javascript
describe('HelloHandler', () => {
  describe('handleRequest()', () => {
    it('should return Hello world with 200 status', () => {
      // Arrange
      const req = { method: 'GET' };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      // Act
      helloHandler.handleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Hello world');
    });
  });
});
```

### Running Tests

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

### Test Coverage Requirements

All pull requests must maintain or improve the current test coverage. The minimum required coverage thresholds are:

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

The CI pipeline will fail if these thresholds are not met.

## Pull Request Process

### Branch Naming Convention

Use the following naming convention for branches:

- `feature/short-description` for new features
- `bugfix/short-description` for bug fixes
- `docs/short-description` for documentation changes
- `refactor/short-description` for code refactoring
- `test/short-description` for test improvements

### Development Workflow

1. Create a new branch from `main` for your changes
2. Make your changes in small, logical commits
3. Write or update tests for your changes
4. Ensure all tests pass locally
5. Run the linter and fix any issues
6. Update documentation if necessary
7. Push your branch to your fork
8. Create a pull request to the `main` branch of the original repository

### Pull Request Requirements

All pull requests must:

1. Include a clear description of the changes
2. Reference any related issues
3. Pass all CI checks (linting, tests, build)
4. Meet code coverage requirements
5. Be reviewed and approved by at least one maintainer
6. Have no merge conflicts with the target branch

### Pull Request Template

When creating a pull request, please use the provided template, which includes:

- Description of the change
- Type of change (bug fix, feature, etc.)
- How the change has been tested
- Checklist of requirements

### Code Review Process

1. Maintainers will review your code for:
   - Adherence to coding standards
   - Test coverage and quality
   - Architectural consistency
   - Performance implications
   - Security considerations
2. Address any feedback from reviewers
3. Once approved, a maintainer will merge your pull request

## Commit Message Guidelines

We follow a structured commit message format to make the project history more readable and to enable automatic changelog generation.

### Commit Message Format

Each commit message consists of a header, an optional body, and an optional footer:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Header

The header is mandatory and has the following format:

- **type**: Describes the kind of change (see below)
- **scope**: (optional) Describes what part of the codebase is affected
- **subject**: A concise description of the change

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that do not affect the meaning of the code (formatting, etc.)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to the build process, tooling, etc.

#### Examples

```
feat(hello): add support for custom greeting message
fix(server): handle EADDRINUSE error gracefully
docs(readme): update installation instructions
test(routes): improve test coverage for hello endpoint
```

### Body

The body should include the motivation for the change and contrast it with previous behavior.

### Footer

The footer should contain references to issues and breaking changes:

```
Fixes #123
BREAKING CHANGE: The API endpoint /hello now returns JSON instead of plain text
```

## Issue Reporting Guidelines

### Before Submitting an Issue

- Check the documentation for solutions to common problems
- Search existing issues to avoid duplicates
- Verify the issue is reproducible with the latest version

### Bug Reports

When reporting a bug, please use the bug report template and include:

- A clear description of the bug
- Steps to reproduce the behavior
- Expected behavior
- Environment details (Node.js version, OS, etc.)
- Request and response details if applicable
- Console output or error messages
- Screenshots if helpful

### Feature Requests

When requesting a feature, please use the feature request template and include:

- A clear description of the proposed feature
- The problem it solves or value it adds
- Any alternatives you've considered
- Implementation details if you have specific ideas
- How it aligns with the project's goals

### Issue Labels

Issues are categorized with labels to help with organization:

- `bug`: Something isn't working as expected
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## Documentation Contributions

Documentation is a critical part of this project. We welcome contributions to improve the documentation.

### Documentation Structure

The project documentation is organized as follows:

- `README.md`: Main project overview and quick start guide
- `docs/README.md`: Documentation index
- `docs/ARCHITECTURE.md`: System architecture and design
- `docs/CONTRIBUTING.md`: This contribution guide
- `docs/DEPLOYMENT.md`: Deployment instructions
- `src/backend/README.md`: Backend-specific documentation

### Documentation Standards

All documentation should:

- Be written in clear, concise Markdown
- Include appropriate headings and subheadings
- Use code blocks with language specification for code examples
- Use tables for structured information
- Include diagrams when helpful for understanding
- Maintain a consistent tone and style
- Focus on clarity and completeness

### Adding New Documentation

1. Identify the appropriate location for new documentation
2. Create or update the Markdown file
3. Follow the existing style and format
4. Update any references or links in other documentation
5. Submit a pull request with your changes

### Updating Existing Documentation

When updating documentation, please:

1. Ensure accuracy and completeness
2. Maintain the existing structure unless there's a good reason to change it
3. Update all affected documentation files for consistency
4. Verify all links and references remain valid

## Community

### Getting Help

If you need help with contributing to the project, you can:

- Open an issue with the `question` label
- Comment on the relevant issue or pull request
- Reach out to the maintainers directly

### Recognition

All contributors will be recognized in the project. We value every contribution, whether it's code, documentation, tests, or issue reports.

### Becoming a Maintainer

Active contributors who consistently provide high-quality contributions may be invited to become project maintainers. Maintainers have additional responsibilities and privileges, including:

- Reviewing and merging pull requests
- Triaging issues
- Making decisions about project direction
- Representing the project in the community

### Thank You

Thank you for considering contributing to the Node.js Hello World application. Your efforts help improve the project for everyone!
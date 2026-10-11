# MERN Backend Starter

A reusable, modular, and production-oriented backend foundation for building MERN stack applications using Node.js, Express.js, MongoDB, and Mongoose.

This starter provides a structured foundation for configuration management, database connectivity, request validation, centralized error handling, API responses, security middleware, rate limiting, request timeouts, health checks, and graceful shutdown.

The goal is to avoid rebuilding common backend infrastructure for every project while keeping the codebase simple, maintainable, and easy to extend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Commands](#available-commands)
- [Health Endpoints](#health-endpoints)
- [Project Structure](#project-structure)
- [Request Lifecycle](#request-lifecycle)
- [Adding a New Feature](#adding-a-new-feature)
- [Error Handling](#error-handling)
- [API Response Format](#api-response-format)
- [Security Practices](#security-practices)
- [Testing and Code Quality](#testing-and-code-quality)
- [Architecture Documentation](#architecture-documentation)
- [Design Principles](#design-principles)
- [License](#license)

---

## Overview

This project serves as the foundation for new Node.js and Express.js backend applications.

Instead of starting with an empty Express application, developers can use this starter to establish a consistent structure for configuration, routing, validation, error handling, database connectivity, and operational reliability.

The starter follows a modular architecture. Core infrastructure is shared across the application, while business-specific functionality is implemented as independent modules.

### Intended Use Cases

- MERN stack applications
- REST API development
- Academic and portfolio projects
- Hackathon projects
- Startup and MVP backends
- Production-oriented application foundations

**Note:** This is a reusable backend foundation, not a complete business application. Features such as authentication, authorization, payments, file uploads, Redis, and background jobs should be added when the individual project requires them.

---

## Features

### Core Application

- Express.js application setup
- Centralized API route composition
- Environment variable management
- Modular project structure
- JSON and URL-encoded request parsing

### Database

- MongoDB connection using Mongoose
- Database connection status checks
- Connection lifecycle event handling
- Database readiness checks
- Graceful database disconnection

### Error Handling and Responses

- Centralized application error class
- Standardized API response structure
- Centralized error-handling middleware
- Consistent handling of common database errors
- Request ID inclusion for error tracking
- Not-found route handling

### Request Processing

- Request ID generation and propagation
- Zod-based request validation
- Asynchronous route-handler utility
- Request timeout middleware
- Configurable request rate limiting

### Security and Performance

- Security headers using Helmet
- Configurable CORS policy
- HTTP response compression
- Request payload size limits
- Rate limiting against excessive requests
- Express framework-identification header disabled

### Operational Reliability

- Liveness endpoint
- Readiness endpoint
- Graceful server shutdown
- Database shutdown handling
- Retry utility for selected transient failures

### Development

- ES modules
- ESLint flat configuration
- Nodemon for development
- Feature-based architecture

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| Zod | Request and data validation |
| Helmet | HTTP security headers |
| CORS | Cross-origin request configuration |
| Compression | HTTP response compression |
| express-rate-limit | Request rate limiting |
| dotenv | Environment variable loading |
| ESLint | Code quality and linting |
| Nodemon | Automatic server restart during development |

---

## Prerequisites

Install the following before running the application:

- Node.js (a version compatible with the installed dependencies)
- npm
- MongoDB running locally or a MongoDB connection URI
- Git (optional, but recommended)

Verify the installations:

\`\`\`bash
node --version
npm --version
\`\`\`

---

## Getting Started

### 1. Clone the Repository

If the project is stored in a Git repository:

\`\`\`bash
git clone <repository-url>
cd mern-backend-starter
\`\`\`

Alternatively, open the project directory directly in your terminal.

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as the reference.

Example:

\`\`\`env
NODE_ENV=development
APP_NAME=MERN_BACKEND
API_VERSION=v1
PORT=5000

CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/mern_backend
\`\`\`

Update the values according to your local environment.

### 4. Start MongoDB

Ensure MongoDB is running and accessible through the configured `MONGODB_URI`.

If you use MongoDB Atlas, replace the local connection URI with your Atlas connection URI.

### 5. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The server should start after the required configuration has been loaded and the database connection has been established.

The default port in the example configuration is `5000`.

### 6. Verify the API

Open the following endpoints in your browser or API client:

\`\`\`text
GET http://localhost:5000/api/v1/health/live
GET http://localhost:5000/api/v1/health/ready
\`\`\`

The liveness endpoint checks whether the application is running. The readiness endpoint checks whether the application is ready to serve requests, including its database dependency.

---

## Environment Variables

The following variables are used by the base configuration.

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Application environment | `development` |
| `APP_NAME` | Application identifier | `MERN_BACKEND` |
| `API_VERSION` | API version prefix | `v1` |
| `PORT` | HTTP server port | `5000` |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/mern_backend` |

### Environment File Rules

- `.env` contains local environment values and secrets.
- `.env.example` documents the variables required to configure the project.
- Never commit real credentials or production secrets.
- Add new environment variables to both the configuration module and `.env.example` when they become part of the application configuration.

---

## Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server with Nodemon |
| `npm start` | Start the application |
| `npm run lint` | Run ESLint checks |

Run linting before committing changes:

\`\`\`bash
npm run lint
\`\`\`

---

## Health Endpoints

The starter provides endpoints for basic application health checks.

### Liveness

\`\`\`http
GET /api/v1/health/live
\`\`\`

Indicates whether the application process is alive and responding.

### Readiness

\`\`\`http
GET /api/v1/health/ready
\`\`\`

Checks whether the application is ready to accept requests based on its required dependencies and shutdown state.

These endpoints can be used by deployment platforms, monitoring systems, and container orchestration tools.

**Important:** Liveness and readiness have different purposes. A temporarily unavailable database may make the application unready without necessarily meaning that the application process itself is dead.

---

## Project Structure

The project is organized into shared infrastructure, reusable middleware, and feature modules.

\`\`\`text
mern-backend-starter/
├── docs/
│   └── PROJECT_STRUCTURE.md
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── db.js
│   │   └── index.js
│   ├── core/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── responses/
│   │   ├── runtime/
│   │   └── utils/
│   ├── middleware/
│   ├── modules/
│   │   └── health/
│   ├── routes/
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
\`\`\`

### Main Directories

| Directory | Responsibility |
|---|---|
| `config/` | Environment configuration and database connectivity |
| `core/constants/` | Shared status codes and error codes |
| `core/errors/` | Application error definitions |
| `core/responses/` | Standardized API response utilities |
| `core/runtime/` | Application runtime state |
| `core/utils/` | Reusable utilities such as async handlers and retry logic |
| `middleware/` | Request processing, validation, security-related policies, and error handling |
| `modules/` | Independent application features |
| `routes/` | Central API route composition |
| `tests/unit/` | Unit tests |
| `tests/integration/` | Integration tests |
| `docs/` | Detailed architecture and project documentation |

For a detailed explanation of the directory structure, responsibilities, and extension guidelines, see [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md).

---

## Request Lifecycle

A typical API request passes through the following stages:

\`\`\`text
Incoming Request
       |
       v
Security Headers and Request ID
       |
       v
CORS, Compression and Rate Limiting
       |
       v
Request Timeout and Body Parsing
       |
       v
API Route
       |
       v
Validation and Controller Logic
       |
       v
Standardized API Response
       |
       v
Outgoing Response
\`\`\`

If a request fails, the error is passed to the centralized error-handling middleware, which formats the response consistently.

The exact middleware order is defined in `src/app.js`. Individual route handlers and feature modules may add their own validation and business logic.

---

## Adding a New Feature

Business functionality should be implemented inside `src/modules/`.

For example, when adding a product-management feature:

\`\`\`text
src/
└── modules/
    └── products/
        ├── product.model.js
        ├── product.controller.js
        ├── product.routes.js
        ├── product.validation.js
        └── index.js
\`\`\`

This is an example structure, not a set of files that already exists.

### Recommended Workflow

1. Define the feature requirements and API endpoints.
2. Create the feature module.
3. Add a Mongoose model if persistent data is required.
4. Define request schemas using Zod.
5. Implement controller logic.
6. Register the feature routes in the central route composition.
7. Add appropriate unit and integration tests.
8. Run linting and verify the request and error lifecycle.

### Keep Features Independent

Feature-specific models, validation schemas, controllers, and routes should remain within their feature module when practical.

Add separate `services/` or `repositories/` directories only when the complexity of the feature justifies them. They are not mandatory for every module.

---

## Error Handling

The starter uses a centralized error-handling approach.

Errors can be passed to Express error middleware using `next(error)`. Asynchronous route handlers should use the shared async-handler utility where appropriate.

The centralized error handler is responsible for converting known errors into a consistent API response while avoiding the exposure of internal implementation details.

Typical errors include:

- Invalid request data
- Missing routes
- Missing resources
- Duplicate database records
- Database validation errors
- Request payloads that exceed configured limits
- Rate-limit violations
- Unexpected internal errors

In production, internal stack traces and sensitive implementation details should not be returned to clients.

---

## API Response Format

Successful responses use a consistent structure.

Example:

\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "Request completed successfully",
  "data": {
    "id": "example-id"
  },
  "meta": null,
  "requestId": "example-request-id"
}
\`\`\`

Error responses follow a corresponding structure containing an error code and, when appropriate, safe error details.

The exact response fields are implemented by the shared response and error utilities. Individual controllers should reuse those utilities rather than inventing a different response format for every endpoint.

---

## Security Practices

Follow these practices when extending the starter:

- Keep secrets in environment variables or a dedicated secrets manager.
- Validate all untrusted input.
- Use explicit CORS origins instead of unrestricted origins when credentials are involved.
- Apply appropriate request size and rate limits.
- Avoid returning stack traces or sensitive database details to clients.
- Keep dependencies updated and review security advisories.
- Use HTTPS in production.
- Add authentication and authorization when the application requires protected resources.
- Apply least-privilege database credentials.
- Avoid logging passwords, access tokens, refresh tokens, or other secrets.

The base starter includes foundational security middleware. It does not automatically provide authentication, authorization, or protection against every application-specific security risk.

---

## Testing and Code Quality

The project reserves separate directories for unit and integration tests.

### Unit Tests

Use unit tests to verify isolated functions, utilities, validation logic, and other components without requiring the entire application to run.

### Integration Tests

Use integration tests to verify interactions between components, such as API routes, middleware, controllers, and database operations.

### Code Quality

Run:

\`\`\`bash
npm run lint
\`\`\`

Add test scripts and a testing framework when the testing setup is implemented. Do not assume that test execution is configured merely because the test directories exist.

---

## Architecture Documentation

The root README provides the quick-start guide and an overview of the project.

The detailed architecture documentation is maintained separately:

- **[`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)** — Directory responsibilities, core components, module organization, and extension guidelines.

Keep the root README concise enough for a developer to understand the project and run it quickly. Put deeper implementation and architectural explanations in the documentation directory.

---

## Design Principles

This starter follows these principles:

1. **Modularity** — Organize business features into independent modules.
2. **Reusability** — Keep common infrastructure separate from business-specific logic.
3. **Consistency** — Standardize request validation, errors, and API responses.
4. **Maintainability** — Prefer clear, understandable code over unnecessary abstraction.
5. **Reliability** — Handle database lifecycle events, timeouts, and shutdowns deliberately.
6. **Security** — Apply foundational protections and validate untrusted input.
7. **Extensibility** — Add optional infrastructure and application features only when needed.
8. **Simplicity** — Avoid mandatory abstractions or dependencies that do not provide practical value.

---

## License

This project is currently licensed under the ISC license, as declared in `package.json`.

Update the license and add a `LICENSE` file if you choose a different distribution model.
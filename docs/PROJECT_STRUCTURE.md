# Project Structure and Architecture

This document explains the architecture, directory structure, file responsibilities, request lifecycle, and extension guidelines for the MERN Backend Starter.

It is intended to help developers understand not only where code belongs, but also why it belongs there and how the different parts of the application work together.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Complete Project Structure](#2-complete-project-structure)
3. [Root-Level Files](#3-root-level-files)
4. [Source Directory](#4-source-directory)
5. [Configuration Layer](#5-configuration-layer)
6. [Core Layer](#6-core-layer)
7. [Middleware Layer](#7-middleware-layer)
8. [Feature Modules](#8-feature-modules)
9. [Central Route Composition](#9-central-route-composition)
10. [Application Entry Points](#10-application-entry-points)
11. [Request Lifecycle](#11-request-lifecycle)
12. [Error Handling Flow](#12-error-handling-flow)
13. [API Response Convention](#13-api-response-convention)
14. [Adding a New Feature](#14-adding-a-new-feature)
15. [Services and Repositories](#15-services-and-repositories)
16. [Optional Infrastructure](#16-optional-infrastructure)
17. [Testing Structure](#17-testing-structure)
18. [Environment and Configuration Rules](#18-environment-and-configuration-rules)
19. [Code Organization Rules](#19-code-organization-rules)
20. [Common Mistakes to Avoid](#20-common-mistakes-to-avoid)

---

# 1. Architecture Overview

The project follows a modular backend architecture.

Shared application infrastructure is kept separate from business functionality. Each business feature is organized into its own module, while common configuration, errors, responses, utilities, and middleware are reused across the application.

The architecture has five primary areas:

| Area | Responsibility |
|---|---|
| Configuration | Load environment variables and manage database connectivity |
| Core | Provide reusable errors, responses, constants, runtime state, and utilities |
| Middleware | Process requests and handle cross-cutting concerns |
| Feature modules | Implement application-specific business functionality |
| Application lifecycle | Configure Express, compose routes, start the server, and shut it down safely |

### High-level architecture

```text
                   Client Application
                           |
                           v
                    HTTP Request
                           |
                           v
                  Express Application
                           |
                           v
                       Middleware
                           |
                           v
                    Central API Router
                           |
                           v
                    Feature Module
                 /         |         \
                v          v          v
           Validation   Controller   Model
                           |
                           v
                     Database Access
                           |
                           v
                        MongoDB

       Shared Core, Configuration and Error Handling
             Support the application throughout
```

This diagram represents the conceptual architecture. A particular request may not use every component, and database access is required only for operations that need persistence.

### Why this architecture?

Suppose you build an e-commerce application.

You may have these features:

- Authentication
- Users
- Products
- Cart
- Orders
- Payments

Each feature has its own business rules, controllers, routes, and possibly models and validation schemas.

However, all features can reuse the same request validation middleware, error handling, response utilities, database connection, and configuration.

This avoids duplicating common infrastructure across the application.

---

# 2. Complete Project Structure

The following is the intended base structure.

```text
mern-backend-starter/
│
├── docs/
│   └── PROJECT_STRUCTURE.md
│
├── src/
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── db.js
│   │   └── index.js
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── errorCodes.js
│   │   │   ├── httpStatus.js
│   │   │   └── index.js
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.js
│   │   │   └── index.js
│   │   │
│   │   ├── responses/
│   │   │   ├── ApiResponse.js
│   │   │   └── index.js
│   │   │
│   │   ├── runtime/
│   │   │   ├── appState.js
│   │   │   └── index.js
│   │   │
│   │   └── utils/
│   │       ├── asyncHandler.js
│   │       ├── logger.js
│   │       ├── timeFormat.js
│   │       ├── retry.js
│   │       └── index.js
│   │
│   ├── middleware/
│   │   ├── requestId.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── requestTimeout.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── index.js
│   │
│   ├── modules/
│   │   └── health/
│   │       ├── health.controller.js
│   │       ├── health.routes.js
│   │       └── index.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── unit/
│   │   └── .gitkeep
│   └── integration/
│       └── .gitkeep
│
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
```

This structure represents the intended foundation, not a requirement that every future application retain every file. Some files may be optional depending on the implementation.

For example, if a new project does not need a retry utility, that utility can be removed along with its exports and imports.

---

# 3. Root-Level Files

Root-level files configure the project, manage dependencies, document usage, and support development.

## `package.json`

Defines project metadata, dependencies, and npm scripts.

Example:

```json
{
  "name": "mern-backend-starter",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "lint": "eslint ."
  }
}
```

**Responsibilities:**

- Identify the project.
- Declare runtime and development dependencies.
- Define commands for development, production startup, and linting.
- Enable JavaScript ES modules through `"type": "module"`.

Use `npm install` to install dependencies and maintain `package-lock.json`.

## `.env`

Stores environment-specific configuration.

Example:

```env
NODE_ENV=development
APP_NAME=MERN_BACKEND
API_VERSION=v1
PORT=5000

CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/mern_backend
```

This file should not be committed when it contains local secrets or environment-specific values.

## `.env.example`

Documents the environment variables required by the application without containing real secrets.

Example:

```env
NODE_ENV=development
APP_NAME=MERN_BACKEND
API_VERSION=v1
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/mern_backend
```

Whenever a new required environment variable is introduced, update `.env.example` as well.

## `.gitignore`

Lists files and directories Git should not track.

Common entries include:

```gitignore
node_modules/
.env
.env.*
!.env.example

coverage/
dist/
build/

*.log
.DS_Store
Thumbs.db
```

Adjust these rules if your project intentionally tracks additional environment files or generated artifacts.

## `eslint.config.js`

Contains the ESLint flat configuration.

It defines the JavaScript environment and the rules used to identify common coding errors and maintain consistency.

Run it with:

```bash
npm run lint
```

## `package-lock.json`

Records the resolved dependency tree for more reproducible installations.

Commit this file to version control for an application repository. Update it through npm rather than manually editing its contents.

## `README.md`

Provides the quick-start guide.

It should explain:

- What the project is.
- How to install dependencies.
- How to configure environment variables.
- How to run the server.
- Which health endpoints are available.
- Where to find detailed architecture documentation.

## `docs/PROJECT_STRUCTURE.md`

Explains the architecture in detail.

This is the document you are reading. It describes file responsibilities, request processing, feature organization, and extension rules.

---

# 4. Source Directory

The `src/` directory contains the application's implementation.

```text
src/
├── config/
├── core/
├── middleware/
├── modules/
├── routes/
├── app.js
└── server.js
```

Each area has a distinct responsibility.

- `config/` manages environment configuration and database connectivity.
- `core/` provides shared application primitives.
- `middleware/` implements reusable request-processing behavior.
- `modules/` contains business and operational features.
- `routes/` combines feature routers.
- `app.js` configures Express.
- `server.js` manages the HTTP server and application lifecycle.

A useful rule is:

**If code is shared infrastructure, it usually belongs in `core/`, `config/`, or `middleware/`. If code implements a specific business capability, it usually belongs in `modules/`.**

---

# 5. Configuration Layer

Location: `src/config/`

```text
config/
├── env.js
├── db.js
└── index.js
```

The configuration layer centralizes environment settings and database connectivity.

## 5.1 `env.js`

**Purpose:** Load and validate environment variables.

Responsibilities include:

- Loading `.env`.
- Reading required and optional variables.
- Parsing numeric variables.
- Providing default values where appropriate.
- Rejecting invalid configuration before the server starts.

For example, a port should be a valid integer within the permitted TCP port range.

Example usage:

```js
import { env } from "../config/index.js";

console.log(env.app.port);
console.log(env.database.uri);
```

Prefer reading configuration through this module rather than accessing `process.env` throughout the application.

This provides one place to validate configuration and makes the rest of the code easier to understand.

## 5.2 `db.js`

**Purpose:** Manage the MongoDB connection through Mongoose.

Responsibilities include:

- Connecting to MongoDB.
- Handling connection lifecycle events.
- Reporting connection failures.
- Exposing a database readiness check.
- Disconnecting cleanly during shutdown.

Example:

```js
import {
    connectDatabase,
    isDatabaseConnected
} from "../config/index.js";

await connectDatabase();

if (!isDatabaseConnected()) {
    throw new Error("Database is not connected");
}
```

This is an illustrative example. The server should normally establish the database connection as part of its startup lifecycle.

Database connection logic should not be duplicated inside individual controllers.

MongoDB lifecycle events use the shared logger from `src/core/utils/logger.js`. This keeps database logs consistent with server lifecycle logs and application error logs. Timestamp formatting is handled centrally by `timeFormat.js`, rather than being duplicated in the database configuration.

## 5.3 `index.js`

**Purpose:** Provide a single import location for configuration exports.

Example:

```js
export { env } from "./env.js";

export {
    connectDatabase,
    disconnectDatabase,
    isDatabaseConnected
} from "./db.js";
```

Consumers can import related configuration functions from one location:

```js
import {
    env,
    connectDatabase
} from "./config/index.js";
```

This file is a barrel export. It improves import consistency but should not contain the actual database or environment-loading logic.

---

# 6. Core Layer

Location: `src/core/`

The core layer contains reusable components that are not tied to a particular business feature.

```text
core/
├── constants/
├── errors/
├── responses/
├── runtime/
└── utils/
```

## 6.1 Constants

Location: `src/core/constants/`

```text
constants/
├── errorCodes.js
├── httpStatus.js
└── index.js
```

### `errorCodes.js`

Defines machine-readable error identifiers.

Examples:

```js
VALIDATION_ERROR
ROUTE_NOT_FOUND
RESOURCE_NOT_FOUND
INTERNAL_SERVER_ERROR
SERVICE_UNAVAILABLE
```

A frontend can use these codes to handle specific errors without relying on the wording of the message.

For example, the frontend could display a validation message when it receives `VALIDATION_ERROR`.

Keep optional authentication-related codes commented out until the application implements authentication.

### `httpStatus.js`

Centralizes HTTP status codes.

Examples:

- `200` — OK
- `201` — Created
- `400` — Bad Request
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `422` — Unprocessable Content
- `429` — Too Many Requests
- `500` — Internal Server Error
- `503` — Service Unavailable

Use the shared constants instead of repeatedly writing unexplained numeric status codes.

### `index.js`

Exports the shared constants.

Example:

```js
export { HTTP_STATUS } from "./httpStatus.js";
export { ERROR_CODES } from "./errorCodes.js";
```

## 6.2 Errors

Location: `src/core/errors/`

```text
errors/
├── AppError.js
└── index.js
```

### `AppError.js`

Defines a reusable application error class.

Instead of constructing a different error shape in every controller, use a consistent error containing information such as:

- Human-readable message.
- HTTP status code.
- Machine-readable error code.
- Optional safe details.
- Original error as a cause, where appropriate.
- Whether the error is considered operational.

Example:

```js
throw new AppError(
    "Product not found",
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.RESOURCE_NOT_FOUND
);
```

This example assumes the relevant constants have been imported and the constructor matches the current implementation.

The central error middleware can then convert the error into an API response.

### `index.js`

Exports `AppError` so other parts of the application can import it consistently.

## 6.3 Responses

Location: `src/core/responses/`

```text
responses/
├── ApiResponse.js
└── index.js
```

### `ApiResponse.js`

Provides a standardized structure for successful API responses.

Typical response fields include:

- `success`
- `statusCode`
- `message`
- `data`
- `meta`
- `requestId`

Example usage:

```js
return ApiResponse.ok(
    res,
    "Products retrieved successfully",
    products
);
```

The actual method signature must match the implementation in `ApiResponse.js`.

### Why centralize responses?

Without a shared response utility, different controllers may return inconsistent JSON structures.

A shared utility keeps the API predictable for frontend developers and makes response changes easier to maintain.

## 6.4 Runtime

Location: `src/core/runtime/`

```text
runtime/
├── appState.js
└── index.js
```

### `appState.js`

Stores small pieces of application-wide runtime state.

The current starter uses it to track whether the application is shutting down.

Example:

```js
if (isApplicationShuttingDown()) {
    // Reject readiness or avoid starting new work.
}
```

This is runtime state, not persistent business data.

Do not use this module as a general-purpose global store for users, orders, or other application records.

### `index.js`

Exports the runtime-state functions.

## 6.5 Utilities

Location: `src/core/utils/`

```text
utils/
├── asyncHandler.js
├── retry.js
├── logger.js
├── timeFormat.js
└── index.js
```

### `asyncHandler.js`

Provides a reusable wrapper for asynchronous Express route handlers.

Example:

```js
router.get(
    "/",
    asyncHandler(async (req, res) => {
        // Perform asynchronous work.
        // Errors are forwarded to Express error handling.
    })
);
```

Express 5 already forwards rejected promises from asynchronous handlers. This utility can still provide a consistent convention, but it is not mandatory for every Express 5 route.

### `retry.js`

Provides controlled retry behavior for operations that may fail temporarily.

Potential use cases include:

- Transient network failures.
- Temporary external service errors.
- Selected database or infrastructure operations.

Retries should be limited and should use an appropriate delay.

**Important:** Do not retry every failure. Validation errors and most other client errors will not become successful simply by repeating the same request. Retrying a write operation can also create duplicate side effects unless that operation is designed to be safe to retry.


### `logger.js`

**Purpose:** Provide centralized application logging.

Responsibilities include:

- Logging informational messages, warnings, and errors.
- Formatting log output consistently across application modules.
- Producing readable logs during development.
- Producing structured JSON logs in production.
- Including relevant metadata, such as request IDs, HTTP methods, paths, and error details.
- Using the shared timestamp formatter for consistent date and time formatting.

Use the shared logger instead of calling `console.log()`, `console.warn()`, or `console.error()` directly throughout application code.

Example:

```js
import { logger } from "../../core/utils/logger.js";

logger.info("Application started", {
    port: 5000
});

logger.error("Database operation failed", {
    errorMessage: error.message
});
```

### `timeFormat.js`

**Purpose:** Provide reusable date and time formatting.

Responsibilities include:

- Formatting JavaScript dates into a human-readable representation.
- Using the configured time zone for consistent timestamps.
- Keeping timestamp formatting logic separate from logging logic.

The current implementation formats timestamps using Indian Standard Time (`Asia/Kolkata`).

Example:

```js
import { formatTimestamp } from "./index.js";

const timestamp = formatTimestamp();

console.log(timestamp);
```

Example output:

```text
11 Oct 2026, 05:45:30 PM IST
```

The logger uses this utility automatically, so other modules do not need to format timestamps independently.

### `index.js`

Exports reusable utilities from one location.

---

# 7. Middleware Layer

Location: `src/middleware/`

Middleware processes requests before they reach controllers and handles errors after failures occur.

```text
middleware/
├── requestId.middleware.js
├── validate.middleware.js
├── rateLimit.middleware.js
├── requestTimeout.middleware.js
├── error.middleware.js
├── notFound.middleware.js
└── index.js
```

## 7.1 Request ID Middleware

File: `requestId.middleware.js`

Assigns a correlation identifier to each request.

Example response header:

```http
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

Request IDs help correlate a client report with server logs.

Incoming request IDs should be validated before being trusted. They are identifiers, not authentication credentials.

## 7.2 Validation Middleware

File: `validate.middleware.js`

Validates incoming request data using Zod schemas.

Common validation targets include:

- Request body.
- Route parameters.
- Query parameters.
- Request headers, when necessary.

Example schema:

```js
import { z } from "zod";

const createProductSchema = z.object({
    name: z.string().trim().min(1),
    price: z.number().positive()
});
```

A route can validate its input before calling business logic.

For example, a product-creation request should reject an empty name or a non-positive price.

Validation prevents malformed data from reaching the controller. It does not replace authorization or business-rule checks.

## 7.3 Rate-Limit Middleware

File: `rateLimit.middleware.js`

Limits how frequently clients can send requests.

The base configuration provides a general application-wide limit. Sensitive endpoints may require separate, stricter limits.

For example, a future login endpoint may use a stricter rate limit than a public product-list endpoint.

## 7.4 Request-Timeout Middleware

File: `requestTimeout.middleware.js`

Defines a maximum amount of time for request processing.

If a request exceeds the configured timeout, the middleware can return a timeout error when a response is still possible.

A response timeout does not automatically cancel database queries or other asynchronous work already in progress. Operations requiring cancellation need their own cancellation or timeout handling.

## 7.5 Not-Found Middleware

File: `notFound.middleware.js`

Handles requests that do not match a registered route.

Example:

```http
GET /api/v1/unknown-route
```

The middleware returns a consistent 404 response instead of allowing unmatched requests to produce an inconsistent result.

## 7.6 Error Middleware

File: `error.middleware.js`

Handles errors forwarded by routes, controllers, and other middleware.

Its responsibilities include:

1. Recognizing known errors.
2. Mapping them to suitable HTTP status codes.
3. Returning a consistent error response.
4. Avoiding the exposure of sensitive internal details.
5. Including the request ID where available.
6. Logging unexpected server errors appropriately.

Feature-specific error normalization, such as JWT errors, can be enabled when authentication is introduced.

## 7.7 `index.js`

Exports the middleware functions and factories.

Example:

```js
export { default as requestId } from "./requestId.middleware.js";
export { errorHandler } from "./error.middleware.js";
export { notFoundHandler } from "./notFound.middleware.js";
```

The exact exports should match the current middleware files.

---

# 8. Feature Modules

Location: `src/modules/`

Feature modules contain business functionality and operational endpoints.

The starter includes a health module:

```text
modules/
└── health/
    ├── health.controller.js
    ├── health.routes.js
    └── index.js
```

## 8.1 Controller

File: `health.controller.js`

Contains the handlers for liveness and readiness checks.

The liveness handler indicates whether the application process is responding.

The readiness handler checks whether required dependencies, such as MongoDB, are available and whether the application is shutting down.

Controllers should coordinate a request and response. Business rules should not be duplicated across multiple route handlers.

## 8.2 Routes

File: `health.routes.js`

Defines the health module's endpoints and associates them with controller handlers.

Example endpoint paths:

```http
GET /health/live
GET /health/ready
```

The central router mounts these paths under the configured API prefix.

## 8.3 Module Export

File: `health/index.js`

Exports the health router for use by the central route composition.

### Example: A future products module

A products module might eventually look like this:

```text
modules/
└── products/
    ├── product.model.js
    ├── product.validation.js
    ├── product.controller.js
    ├── product.routes.js
    └── index.js
```

Responsibilities:

| File | Responsibility |
|---|---|
| `product.model.js` | Defines the Mongoose product schema and model |
| `product.validation.js` | Defines Zod schemas for incoming product data |
| `product.controller.js` | Implements product endpoint behavior |
| `product.routes.js` | Connects endpoint paths to middleware and controllers |
| `index.js` | Exports the module router |

This is an example for a future feature, not a claim that these files already exist.

---

# 9. Central Route Composition

Location: `src/routes/index.js`

The central router combines routers from individual modules.

Conceptually:

```text
Central Router
    |
    ├── Health Router
    ├── Products Router       (future)
    ├── Users Router          (future)
    └── Orders Router         (future)
```

Example of what route composition may look like as features are added:

```js
import { Router } from "express";
import healthRoutes from "../modules/health/index.js";

// Import feature routers when those modules exist.
// import productRoutes from "../modules/products/index.js";

const router = Router();

router.use("/health", healthRoutes);

// Register additional feature routers when implemented.
// router.use("/products", productRoutes);

export default router;
```

The example assumes the health module exports its router as the default export. Preserve the actual export convention used by your existing files.

The central router should primarily compose routes. It should not contain product creation, payment processing, database queries, or other business logic.

---

# 10. Application Entry Points

Two files have different responsibilities: `app.js` and `server.js`.

## 10.1 `app.js`

**Purpose:** Create and configure the Express application.

Responsibilities generally include:

- Disabling unnecessary framework-identifying headers.
- Registering security middleware.
- Configuring CORS.
- Registering request IDs.
- Enabling compression.
- Applying rate limits and request timeouts.
- Parsing request bodies.
- Mounting the central API router.
- Registering not-found and error middleware.

The application should have one clearly defined middleware order.

Example:

```text
Create Express Application
          |
          v
Register Shared Middleware
          |
          v
Mount API Router
          |
          v
Register Not-Found Handler
          |
          v
Register Error Handler
```

The exact sequence is defined by `src/app.js`.

## 10.2 `server.js`

**Purpose:** Manage the application lifecycle and HTTP server.

Responsibilities generally include:

1. Establish the database connection.
2. Create or import the configured Express application.
3. Start the HTTP server.
4. Handle startup failures.
5. Handle termination signals.
6. Stop accepting new connections during shutdown.
7. Close database connections.
8. Exit cleanly after shutdown, or report a shutdown failure.
9. Logging server startup and shutdown events.
10. Logging unexpected server errors and unhandled process failures through the shared logger.

Keeping this separate from `app.js` makes the Express application easier to test without automatically starting a listening server.

A clean shutdown is important because it allows active requests
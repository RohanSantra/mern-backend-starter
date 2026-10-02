import ApiResponse from "../../core/responses/ApiResponse.js";

import {
    HTTP_STATUS
} from "../../core/constants/index.js";

import {
    isDatabaseConnected
} from "../../config/index.js";

import {
    isApplicationShuttingDown
} from "../../core/runtime/index.js";

/**
 * Checks whether the application process is alive.
 *
 * This endpoint intentionally does not check external
 * dependencies such as MongoDB.
 *
 * A successful response means the Node.js process is
 * running and able to handle HTTP requests.
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Liveness response.
 */
const liveness = (req, res) => {
    return ApiResponse.ok(
        res,
        "Service is alive",
        {
            status: "alive"
        }
    );
};

/**
 * Checks whether the application is ready to serve traffic.
 *
 * Readiness depends on:
 *
 * 1. The application not being in shutdown mode.
 * 2. MongoDB being connected.
 *
 * If either condition fails, the application reports
 * HTTP 503 Service Unavailable.
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Readiness response.
 */
const readiness = (req, res) => {
    const shuttingDown =
        isApplicationShuttingDown();

    const databaseConnected =
        isDatabaseConnected();

    if (shuttingDown) {
        return res.status(
            HTTP_STATUS.SERVICE_UNAVAILABLE
        ).json({
            success: false,
            statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
            message: "Service is shutting down",
            data: {
                status: "not_ready",
                dependencies: {
                    database: databaseConnected
                        ? "available"
                        : "unavailable"
                }
            },
            requestId: req.requestId ?? null
        });
    }

    if (!databaseConnected) {
        return res.status(
            HTTP_STATUS.SERVICE_UNAVAILABLE
        ).json({
            success: false,
            statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
            message: "Service is not ready",
            data: {
                status: "not_ready",
                dependencies: {
                    database: "unavailable"
                }
            },
            requestId: req.requestId ?? null
        });
    }

    return ApiResponse.ok(
        res,
        "Service is ready",
        {
            status: "ready",
            dependencies: {
                database: "available"
            }
        }
    );
};

/**
 * Test successful request handling.
 *
 * This temporary endpoint is used to validate the
 * foundation request lifecycle.
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Successful API response.
 */
const testSuccess = (req, res) => {
    return ApiResponse.ok(
        res,
        "Test request completed successfully",
        {
            message: "Foundation is working correctly"
        }
    );
};

/**
 * Intentionally throws a controlled application error.
 *
 * Used to verify:
 *
 * Request
 * → Route
 * → Controller
 * → AppError
 * → Global error middleware
 * → Standardized error response
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {never}
 */
const testError = (req, res) => {
    throw new AppError(
        "This is an intentional test error",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_REQUEST,
        {
            reason: "Testing the global error-handling lifecycle"
        }
    );
};

export {
    liveness,
    readiness,
    testSuccess,
    testError
};
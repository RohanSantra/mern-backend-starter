import ApiResponse from "../../core/responses/ApiResponse.js";
import AppError from "../../core/errors/AppError.js";

import {
    HTTP_STATUS,
    ERROR_CODES
} from "../../core/constants/index.js";

/**
 * Returns a successful test response.
 *
 * Used to verify the complete successful request lifecycle:
 *
 * Request
 * → Route
 * → Controller
 * → ApiResponse
 * → HTTP Response
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
    testSuccess,
    testError
};
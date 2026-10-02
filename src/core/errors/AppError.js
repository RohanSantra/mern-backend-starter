
import {
    HTTP_STATUS,
    ERROR_CODES
} from "../constants/index.js";

/**
 * Represents a controlled application error.
 *
 * AppError is used for expected failures that should
 * produce a known HTTP status and application error code.
 *
 * Examples:
 * - Resource not found
 * - Invalid credentials
 * - Insufficient permissions
 * - Resource already exists
 *
 * Unexpected programming and system errors should not
 * be converted into operational errors automatically.
 *
 * @extends Error
 */
class AppError extends Error {
    /**
     * Creates a controlled application error.
     *
     * @param {string} message - Human-readable error message.
     * @param {number} [statusCode=500] - HTTP status code.
     * @param {string} [code] - Application error code.
     * @param {unknown} [details=null] - Structured error details.
     * @param {Error|null} [cause=null] - Original underlying error.
     */
    constructor(
        message,
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        code = ERROR_CODES.INTERNAL_SERVER_ERROR,
        details = null,
        cause = null
    ) {
        super(message, cause ? { cause } : undefined);

        if (
            !Number.isInteger(statusCode) ||
            statusCode < 400 ||
            statusCode > 599
        ) {
            throw new TypeError(
                "AppError statusCode must be between 400 and 599"
            );
        }

        this.name = "AppError";

        this.statusCode = statusCode;

        this.code = code;

        this.details = details;

        /**
         * Indicates that this error is an expected
         * application-level failure.
         */
        this.isOperational = true;

        /**
         * Exclude the constructor from the stack trace
         * when supported by the Node.js runtime.
         */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

export default AppError;

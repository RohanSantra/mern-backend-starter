/**
 * Standard application error codes.
 *
 * HTTP status codes describe the category of an HTTP response,
 * while application error codes identify the specific reason
 * for a failure.
 *
 * General and infrastructure error codes are enabled by default.
 * Project-specific groups are provided as optional examples.
 * Enable the groups required by the application and define any
 * additional codes inside the relevant feature module.
 */
const ERROR_CODES = Object.freeze({
    // General application errors
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INVALID_REQUEST: "INVALID_REQUEST",
    INVALID_PARAMETER: "INVALID_PARAMETER",
    ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

    // Database errors
    DATABASE_ERROR: "DATABASE_ERROR",
    DATABASE_CONNECTION_FAILED: "DATABASE_CONNECTION_FAILED",
    DATABASE_TIMEOUT: "DATABASE_TIMEOUT",

    // Rate limiting
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

    // External service errors
    EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
    EXTERNAL_SERVICE_TIMEOUT: "EXTERNAL_SERVICE_TIMEOUT",

    // Request processing errors
    REQUEST_TIMEOUT: "REQUEST_TIMEOUT",
    PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
    UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE"

    /*
     * Optional authentication error codes.
     *
     * Enable these when the application implements authentication.
     *
     * AUTH_REQUIRED: "AUTH_REQUIRED",
     * INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
     * ACCESS_TOKEN_EXPIRED: "ACCESS_TOKEN_EXPIRED",
     * INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
     * REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
     * INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
     * ACCOUNT_NOT_VERIFIED: "ACCOUNT_NOT_VERIFIED",
     * ACCOUNT_NOT_APPROVED: "ACCOUNT_NOT_APPROVED",
     * ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
     * SESSION_EXPIRED: "SESSION_EXPIRED",
     * SESSION_REVOKED: "SESSION_REVOKED",
     */

    /*
     * Optional authorization error codes.
     *
     * Enable these when the application implements permissions
     * or resource-level access control.
     *
     * INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
     * RESOURCE_ACCESS_DENIED: "RESOURCE_ACCESS_DENIED",
     */

    /*
     * Optional user-related error codes.
     *
     * Enable these when the application has a user module.
     *
     * USER_NOT_FOUND: "USER_NOT_FOUND",
     * USER_EMAIL_ALREADY_EXISTS: "USER_EMAIL_ALREADY_EXISTS",
     */

    /*
     * Optional file-handling error codes.
     *
     * Enable these when the application supports file uploads
     * or file management.
     *
     * FILE_TOO_LARGE: "FILE_TOO_LARGE",
     * INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
     * FILE_NOT_FOUND: "FILE_NOT_FOUND",
     * FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
     */
});

export default ERROR_CODES;
/**
 * Standard API response builder.
 *
 * All successful API responses should use this class
 * so that the frontend receives a predictable response
 * structure across every module.
 */
class ApiResponse {
    /**
     * Creates a standardized API response.
     *
     * @param {Object} options - Response configuration.
     * @param {number} options.statusCode - HTTP status code.
     * @param {string} options.message - Human-readable message.
     * @param {*} [options.data=null] - Response payload.
     * @param {*} [options.meta=null] - Optional response metadata.
     * @param {string|null} [options.requestId=null] - Request correlation ID.
     */
    constructor({
        statusCode,
        message,
        data = null,
        meta = null,
        requestId = null
    }) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
        this.requestId = requestId;
    }

    /**
     * Sends a standardized successful API response.
     *
     * @param {import("express").Response} res - Express response object.
     * @param {Object} options - Response configuration.
     * @param {number} options.statusCode - HTTP status code.
     * @param {string} options.message - Human-readable message.
     * @param {*} [options.data=null] - Response payload.
     * @param {*} [options.meta=null] - Optional response metadata.
     * @returns {import("express").Response} Express response.
     */
    static send(
        res,
        {
            statusCode,
            message,
            data = null,
            meta = null
        }
    ) {
        return res.status(statusCode).json(
            new ApiResponse({
                statusCode,
                message,
                data,
                meta,
                requestId: res.req?.requestId ?? null
            })
        );
    }

    /**
     * Sends a 200 OK response.
     *
     * @param {import("express").Response} res - Express response.
     * @param {string} message - Response message.
     * @param {*} [data=null] - Response data.
     * @param {*} [meta=null] - Response metadata.
     * @returns {import("express").Response}
     */
    static ok(res, message, data = null, meta = null) {
        return ApiResponse.send(res, {
            statusCode: 200,
            message,
            data,
            meta
        });
    }

    /**
     * Sends a 201 Created response.
     *
     * @param {import("express").Response} res - Express response.
     * @param {string} message - Response message.
     * @param {*} [data=null] - Created resource.
     * @param {*} [meta=null] - Response metadata.
     * @returns {import("express").Response}
     */
    static created(res, message, data = null, meta = null) {
        return ApiResponse.send(res, {
            statusCode: 201,
            message,
            data,
            meta
        });
    }

    /**
     * Sends a 202 Accepted response.
     *
     * Useful for asynchronous operations that have
     * been accepted but are not yet completed.
     *
     * @param {import("express").Response} res - Express response.
     * @param {string} message - Response message.
     * @param {*} [data=null] - Optional response data.
     * @param {*} [meta=null] - Response metadata.
     * @returns {import("express").Response}
     */
    static accepted(res, message, data = null, meta = null) {
        return ApiResponse.send(res, {
            statusCode: 202,
            message,
            data,
            meta
        });
    }

    /**
     * Sends a 204 No Content response.
     *
     * @param {import("express").Response} res - Express response.
     * @returns {import("express").Response}
     */
    static noContent(res) {
        return res.status(204).send();
    }
}

export default ApiResponse;
import {
    HTTP_STATUS,
    ERROR_CODES
} from "../core/constants/index.js";

import AppError from "../core/errors/AppError.js";

/**
 * Creates request validation middleware from a Zod schema.
 *
 * Validated values are stored under `req.validated`
 * instead of replacing the original Express request
 * properties.
 *
 * This makes it explicit which values have passed
 * validation and sanitization.
 *
 * @param {Object} schema - Zod validation schema.
 * @param {Function} schema.parse - Zod parse function.
 * @param {Object} [options] - Request sections to validate.
 * @param {boolean} [options.body=false] - Validate request body.
 * @param {boolean} [options.params=false] - Validate route parameters.
 * @param {boolean} [options.query=false] - Validate query parameters.
 * @param {boolean} [options.headers=false] - Validate request headers.
 * @returns {import("express").RequestHandler} Validation middleware.
 */
const validateRequest = (
    schema,
    {
        body = false,
        params = false,
        query = false,
        headers = false
    } = {}
) => {
    return (req, res, next) => {
        try {
            const requestData = {};

            if (body) {
                requestData.body = req.body;
            }

            if (params) {
                requestData.params = req.params;
            }

            if (query) {
                requestData.query = req.query;
            }

            if (headers) {
                requestData.headers = req.headers;
            }

            const validatedData = schema.parse(requestData);

            req.validated = {
                ...(req.validated || {}),
                ...validatedData
            };

            next();
        } catch (error) {
            if (error?.name === "ZodError") {
                const details = error.issues.map((issue) => ({
                    field: issue.path.length
                        ? issue.path.join(".")
                        : "request",
                    message: issue.message
                }));

                return next(
                    new AppError(
                        "Validation failed",
                        HTTP_STATUS.UNPROCESSABLE_ENTITY,
                        ERROR_CODES.VALIDATION_ERROR,
                        details,
                        error
                    )
                );
            }

            next(error);
        }
    };
};

export default validateRequest;
/**
 * Wraps an asynchronous Express request handler.
 *
 * Any rejected promise is automatically passed to
 * Express's global error-handling middleware.
 *
 * This prevents every controller from requiring
 * its own repetitive try/catch block.
 *
 * @param {Function} handler - Async Express request handler.
 * @returns {import("express").RequestHandler} Wrapped request handler.
 */
const asyncHandler = (handler) => {
    return (req, res, next) => {
        Promise
            .resolve(handler(req, res, next))
            .catch(next);
    };
};

export default asyncHandler;
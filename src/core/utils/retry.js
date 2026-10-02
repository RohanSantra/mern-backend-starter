/**
 * Determines whether an error represents a retryable failure.
 *
 * @param {unknown} error - Error to inspect.
 * @returns {boolean} True when the operation may be retried.
 */
const isRetryableError = (error) => {
    if (!error) {
        return false;
    }

    if (error.code === "ECONNRESET") {
        return true;
    }

    if (error.code === "ETIMEDOUT") {
        return true;
    }

    if (error.code === "ECONNREFUSED") {
        return true;
    }

    if (error.statusCode === 408) {
        return true;
    }

    if (error.statusCode === 429) {
        return true;
    }

    if (
        Number.isInteger(error.statusCode) &&
        error.statusCode >= 500 &&
        error.statusCode <= 599
    ) {
        return true;
    }

    return false;
};

/**
 * Delays execution for a specified duration.
 *
 * @param {number} milliseconds - Delay duration.
 * @returns {Promise<void>}
 */
const delay = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};

/**
 * Executes an asynchronous operation with retry support.
 *
 * Retries use exponential backoff:
 *
 * attempt 1 → immediate
 * attempt 2 → base delay
 * attempt 3 → base delay × 2
 * attempt 4 → base delay × 4
 *
 * @param {Function} operation - Asynchronous operation to execute.
 * @param {object} [options] - Retry configuration.
 * @param {number} [options.maxAttempts=3] - Maximum total attempts.
 * @param {number} [options.baseDelayMs=250] - Initial backoff delay.
 * @param {number} [options.maxDelayMs=5000] - Maximum backoff delay.
 * @param {Function} [options.shouldRetry=isRetryableError] - Retry decision function.
 * @returns {Promise<unknown>} Result of the operation.
 * @throws {Error} Final error after retries are exhausted.
 */
const retry = async (
    operation,
    {
        maxAttempts = 3,
        baseDelayMs = 250,
        maxDelayMs = 5000,
        shouldRetry = isRetryableError
    } = {}
) => {
    if (typeof operation !== "function") {
        throw new TypeError(
            "Retry operation must be a function"
        );
    }

    if (
        !Number.isInteger(maxAttempts) ||
        maxAttempts < 1
    ) {
        throw new TypeError(
            "Retry maxAttempts must be a positive integer"
        );
    }

    if (
        !Number.isInteger(baseDelayMs) ||
        baseDelayMs < 0
    ) {
        throw new TypeError(
            "Retry baseDelayMs must be a non-negative integer"
        );
    }

    if (
        !Number.isInteger(maxDelayMs) ||
        maxDelayMs < 0
    ) {
        throw new TypeError(
            "Retry maxDelayMs must be a non-negative integer"
        );
    }

    if (typeof shouldRetry !== "function") {
        throw new TypeError(
            "Retry shouldRetry must be a function"
        );
    }

    let lastError;

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt += 1
    ) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            const hasAttemptsRemaining =
                attempt < maxAttempts;

            if (
                !hasAttemptsRemaining ||
                !shouldRetry(error)
            ) {
                throw error;
            }

            const exponentialDelay =
                baseDelayMs *
                (2 ** (attempt - 1));

            const delayMs = Math.min(
                exponentialDelay,
                maxDelayMs
            );

            await delay(delayMs);
        }
    }

    throw lastError;
};

export {
    retry,
    isRetryableError
};
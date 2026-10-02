/**
 * Runtime application state.
 *
 * This state contains information about the current
 * lifecycle of the application process.
 *
 * It is intentionally kept separate from configuration.
 */
const applicationState = {
    isShuttingDown: false
};

/**
 * Marks the application as shutting down.
 *
 * Once this flag becomes true, readiness checks should
 * report that the application is no longer accepting
 * new traffic.
 *
 * @returns {void}
 */
const markShuttingDown = () => {
    applicationState.isShuttingDown = true;
};

/**
 * Returns whether the application is shutting down.
 *
 * @returns {boolean} True when shutdown has started.
 */
const isApplicationShuttingDown = () => {
    return applicationState.isShuttingDown;
};

export {
    markShuttingDown,
    isApplicationShuttingDown
};
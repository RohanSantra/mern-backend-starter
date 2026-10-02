import app from "./app.js";

import {
    env,
    connectDatabase,
    disconnectDatabase
} from "./config/index.js";

import {
    markShuttingDown
} from "./core/runtime/index.js";

/**
 * HTTP server instance.
 *
 * Kept outside the startup function so the
 * shutdown handler can access it.
 */
let server = null;

/**
 * Prevents multiple shutdown sequences from
 * executing simultaneously.
 */
let isShuttingDown = false;

/**
 * Maximum amount of time allowed for graceful shutdown.
 */
const SHUTDOWN_TIMEOUT = 10_000;

/**
 * Starts the application.
 *
 * The database connection is established before the
 * HTTP server begins accepting requests.
 *
 * @returns {Promise<void>}
 */
const startServer = async () => {
    try {
        await connectDatabase();

        server = app.listen(
            env.app.port,
            () => {
                console.log(
                    `${env.app.name} API running on port ${env.app.port}`
                );
            }
        );

        /**
         * Handles HTTP server errors that occur after startup.
         */
        server.on("error", (error) => {
            console.error(
                "HTTP server error:",
                error
            );
        });
    } catch (error) {
        console.error(
            "Application startup failed:",
            error
        );

        process.exit(1);
    }
};

/**
 * Gracefully shuts down the application.
 *
 * Shutdown sequence:
 *
 * 1. Prevent duplicate shutdown attempts.
 * 2. Stop accepting new HTTP connections.
 * 3. Close the MongoDB connection.
 * 4. Exit the process.
 *
 * A timeout prevents the application from remaining
 * stuck during shutdown indefinitely.
 *
 * @param {string} signal - Shutdown signal or failure source.
 * @param {number} [exitCode=0] - Process exit code.
 * @returns {Promise<void>}
 */
const gracefulShutdown = async (
    signal,
    exitCode = 0
) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;

    markShuttingDown();

    console.log(
        `${signal} received. Starting graceful shutdown...`
    );

    const shutdownTimer = setTimeout(() => {
        console.error(
            "Graceful shutdown timed out. Forcing process termination."
        );

        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
        if (server) {
            server.close();

            console.log(
                "HTTP server stopped accepting new connections."
            );
        }

        await disconnectDatabase();

        clearTimeout(shutdownTimer);

        console.log(
            "Application shutdown completed successfully."
        );

        process.exit(exitCode);
    } catch (error) {
        clearTimeout(shutdownTimer);

        console.error(
            "Error during graceful shutdown:",
            error
        );

        process.exit(1);
    }
};

/**
 * Handles operating-system shutdown signals.
 */
process.on("SIGINT", () => {
    gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
    gracefulShutdown("SIGTERM");
});

/**
 * An unhandled promise rejection indicates that
 * the application reached an unexpected state.
 *
 * The process is shut down so that the runtime can
 * be restarted by the process manager or container.
 */
process.on("unhandledRejection", (reason) => {
    console.error(
        "Unhandled promise rejection:",
        reason
    );

    gracefulShutdown(
        "UNHANDLED_REJECTION",
        1
    );
});

/**
 * An uncaught exception leaves the application in an
 * potentially unsafe state.
 *
 * The process is therefore terminated after attempting
 * a graceful shutdown.
 */
process.on("uncaughtException", (error) => {
    console.error(
        "Uncaught exception:",
        error
    );

    gracefulShutdown(
        "UNCAUGHT_EXCEPTION",
        1
    );
});

/**
 * Start the application.
 */
startServer();
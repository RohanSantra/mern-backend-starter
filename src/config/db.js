import mongoose from "mongoose";

import env from "./env.js";

/**
 * MongoDB connection options.
 *
 * These values prevent database operations and connection
 * attempts from remaining open indefinitely.
 */
const MONGODB_OPTIONS = Object.freeze({
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000
});

/**
 * Handles successful MongoDB connections.
 */
mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

/**
 * Handles MongoDB connection errors that occur
 * during startup or after the connection is established.
 *
 * @param {Error} error - MongoDB connection error.
 */
mongoose.connection.on("error", (error) => {
    console.error(
        "MongoDB connection error:",
        error.message
    );
});

/**
 * Handles MongoDB disconnection events.
 *
 * Readiness checks use the current Mongoose connection
 * state, so the API can report that it is not ready while
 * MongoDB is unavailable.
 */
mongoose.connection.on("disconnected", () => {
    console.warn(
        "MongoDB disconnected"
    );
});

/**
 * Handles MongoDB connection attempts.
 */
mongoose.connection.on("connecting", () => {
    console.log(
        "MongoDB connecting..."
    );
});

/**
 * Handles MongoDB reconnection attempts.
 */
mongoose.connection.on("reconnected", () => {
    console.log(
        "MongoDB reconnected"
    );
});

/**
 * Establishes a connection to MongoDB.
 *
 * The HTTP server must successfully connect to MongoDB
 * before it starts accepting requests.
 *
 * Mongoose manages runtime connection recovery after
 * temporary disconnections.
 *
 * @returns {Promise<typeof mongoose>} Connected Mongoose instance.
 * @throws {Error} When the initial database connection fails.
 */
const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(
            env.database.uri,
            MONGODB_OPTIONS
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
        );

        return connection;
    } catch (error) {
        console.error(
            "MongoDB initial connection failed:",
            error.message
        );

        throw error;
    }
};

/**
 * Closes the active MongoDB connection.
 *
 * This is used during graceful application shutdown
 * to release the database connection cleanly.
 *
 * @returns {Promise<void>}
 * @throws {Error} When the database connection cannot be closed.
 */
const disconnectDatabase = async () => {
    try {
        if (
            mongoose.connection.readyState === 0
        ) {
            return;
        }

        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed"
        );
    } catch (error) {
        console.error(
            "MongoDB disconnection failed:",
            error.message
        );

        throw error;
    }
};

/**
 * Returns whether MongoDB is currently connected.
 *
 * Mongoose connection states:
 *
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 *
 * @returns {boolean} True when MongoDB is connected.
 */
const isDatabaseConnected = () => {
    return (
        mongoose.connection.readyState === 1
    );
};

export {
    connectDatabase,
    disconnectDatabase,
    isDatabaseConnected
};
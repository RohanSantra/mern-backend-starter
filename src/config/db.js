import mongoose from "mongoose";
import env from "./env.js";

/**
 * Handles successful MongoDB connections.
 */
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
});

/**
 * Handles MongoDB connection errors that occur after startup.
 */
mongoose.connection.on("error", (error) => {
    console.error(
        "MongoDB connection error:",
        error.message
    );
});

/**
 * Handles MongoDB disconnection events.
 */
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
});

/**
 * Establishes a connection to MongoDB.
 *
 * The application must successfully connect to MongoDB before
 * the HTTP server starts accepting requests.
 *
 * @returns {Promise<typeof mongoose>} Connected Mongoose instance.
 * @throws {Error} When the database connection fails.
 */
const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(
            env.database.uri
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
        );

        return connection;
    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        throw error;
    }
};

/**
 * Closes the active MongoDB connection.
 *
 * This is used during graceful application shutdown
 * to ensure that database resources are released cleanly.
 *
 * @returns {Promise<void>}
 * @throws {Error} When the database connection cannot be closed.
 */
const disconnectDatabase = async () => {
    try {
        await mongoose.connection.close();

        console.log("MongoDB connection closed");
    } catch (error) {
        console.error(
            "MongoDB disconnection failed:",
            error.message
        );

        throw error;
    }
};

export {
    connectDatabase,
    disconnectDatabase
};
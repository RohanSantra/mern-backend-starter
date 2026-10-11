import "dotenv/config";

/**
 * Reads a required environment variable.
 *
 * Throws an error when the variable is missing or empty.
 *
 * @param {string} name - Name of the environment variable.
 * @returns {string} Environment variable value.
 * @throws {Error} When the environment variable is missing.
 */
const getRequiredEnv = (name) => {
    const value = process.env[name];

    if (!value || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value.trim();
};

/**
 * Reads an optional environment variable.
 *
 * Returns the provided default value when the variable is not defined.
 *
 * @param {string} name - Name of the environment variable.
 * @param {string} defaultValue - Default value.
 * @returns {string} Environment variable or default value.
 */
const getOptionalEnv = (name, defaultValue) => {
    const value = process.env[name];

    if (!value || value.trim() === "") {
        return defaultValue;
    }

    return value.trim();
};

/**
 * Reads an optional numeric environment variable.
 *
 * @param {string} name - Name of the environment variable.
 * @param {number} defaultValue - Default value when the variable is unset or empty.
 * @returns {number} Parsed finite numeric value.
 * @throws {Error} When the provided value is not finite.
 */
const getNumberEnv = (name, defaultValue) => {
    const value = process.env[name];

    if (value === undefined || value.trim() === "") {
        return defaultValue;
    }

    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
        throw new Error(
            `Environment variable ${name} must be a finite number`
        );
    }

    return parsedValue;
};

/**
 * Application environment configuration.
 *
 * All environment variables used by the application should be
 * exposed through this configuration object instead of accessing
 * process.env throughout the codebase.
 */
const env = Object.freeze({
    nodeEnv: getOptionalEnv("NODE_ENV", "development"),

    app: {
        name: getOptionalEnv("APP_NAME", "MERN_BACKEND"),
        apiVersion: getOptionalEnv("API_VERSION", "v1"),
        port: getNumberEnv("PORT", 5000)
    },

    client: {
        url: getRequiredEnv("CLIENT_URL")
    },

    database: {
        uri: getRequiredEnv("MONGODB_URI")
    }
});

export default env;
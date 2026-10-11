import express from "express";

import { healthRoutes } from "../modules/health/index.js";

const router = express.Router();

/**
 * Registers application routes.
 *
 * Feature-specific routes are composed here so that
 * app.js does not need to know about individual modules.
 *
 * @param {import("express").Router} router - Express router.
 * @returns {import("express").Router} Configured application router.
 */
const registerRoutes = (router) => {
    router.use(
        healthRoutes
    );

    return router;
};

registerRoutes(router);

export default router;
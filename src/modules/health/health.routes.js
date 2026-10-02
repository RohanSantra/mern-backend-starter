import express from "express";

import {
    liveness,
    readiness,
    testSuccess,
    testError
} from "./health.controller.js";

import {
    asyncHandler
} from "../../core/utils/index.js";

const router = express.Router();

/**
 * Liveness probe.
 */
router.get(
    "/health/live",
    asyncHandler(liveness)
);

/**
 * Readiness probe.
 */
router.get(
    "/health/ready",
    asyncHandler(readiness)
);

/**
 * Temporary successful request test.
 */
router.get(
    "/test-success",
    asyncHandler(testSuccess)
);

/**
 * Temporary controlled error test.
 */
router.get(
    "/test-error",
    asyncHandler(testError)
);

export default router;
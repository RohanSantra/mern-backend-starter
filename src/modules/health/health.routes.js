import express from "express";

import {
    testSuccess,
    testError
} from "./health.controller.js";

import { asyncHandler } from "../../core/utils/index.js";

const router = express.Router();

/**
 * Test successful request handling.
 */
router.get(
    "/test-success",
    asyncHandler(testSuccess)
);

/**
 * Test controlled application errors.
 */
router.get(
    "/test-error",
    asyncHandler(testError)
);

export default router;
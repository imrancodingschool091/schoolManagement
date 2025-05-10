import express from "express";

import {
  getLibraryHistory,
  getSingleLibraryHistory,
  addLibraryHistory,
  updateLibraryHistory,
  deleteLibraryHistory
}  from "../controllers/liabrary.controller.js"
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route GET /api/library
router.get(
  "/",
  authenticate,
  getLibraryHistory
);

// @route GET /api/library/:id
router.get(
  "/:id",
   authenticate,
  getSingleLibraryHistory
);

// @route POST /api/library
router.post(
  "/",
   authenticate,
  addLibraryHistory
);

// @route PUT /api/library/:id
router.put(
  "/:id",
   authenticate,
  updateLibraryHistory
);

// @route DELETE /api/library/:id
router.delete(
  "/:id",
   authenticate,
  deleteLibraryHistory
);

export default router;

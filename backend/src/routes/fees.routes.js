import express from "express";


import {
  addNewFeesHistory,
  deleteFeesHistory,
  getFeesHistory,
  getFeesHistoryById,
  updateFeesHistory,
} from "../controllers/fees.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route GET /api/fees
router.get(
  "/",
  authenticate,
  getFeesHistory
);

// @route GET /api/fees/:id
router.get(
  "/:id",
  authenticate,
  getFeesHistoryById
);

// @route POST /api/fees
router.post("/", authenticate, addNewFeesHistory);

// @route PUT /api/fees/:id
router.put("/:id", authenticate, updateFeesHistory);

// @route DELETE /api/fees/:id
router.delete("/:id", authenticate, deleteFeesHistory);

export default router;

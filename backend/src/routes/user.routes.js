import express from "express";

import { getUserData } from "../controllers/user.controller.js"; // Updated path for controller
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route GET /api/user/me
router.get(
  "/me",
  authenticate,
  
  getUserData
);

export default router;

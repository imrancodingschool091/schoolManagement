import express from "express";

import { 
  getUsers, 
  getUserById, 
  addNewUser, 
  updateUser, 
  deleteUser 
} from "../controllers/users.controller.js"; // Updated path for controller
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route GET /api/users
router.get(
  "/",
  authenticate,
 
  getUsers
);

// @route GET /api/users/:id
router.get(
  "/:id",
  authenticate,
  getUserById
);

// @route POST /api/users
router.post(
  "/",
   authenticate,
  addNewUser
);

// @route PUT /api/users/:id
router.put(
  "/:id",
  authenticate,
  updateUser
);

// @route DELETE /api/users/:id
router.delete(
  "/:id",
  authenticate,
  deleteUser
);

export default router;

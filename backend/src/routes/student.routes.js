import express from "express";

import {
  getStudents,
  getStudentsById,
  addStudent,
  updateStudent,
  deleteStudent
} from "../controllers/student.controller.js"; // Updated path for controller
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route GET /api/student
router.get(
  "/",
   authenticate,
  getStudents
);

// @route GET /api/student/:id
router.get(
  "/:id",
  authenticate,
  getStudentsById
);

// @route POST /api/student
router.post(
  "/",
  authenticate,
  addStudent
);

// @route PUT /api/student/:id
router.put(
  "/:id",
   authenticate,
  updateStudent
);

// @route DELETE /api/student/:id
router.delete(
  "/:id",
  authenticate,
  deleteStudent
);

export default router;

import express from 'express';
import {register,login,getUsers} from "../controllers/auth.controller.js"
const router = express.Router();

// @route POST /api/auth/register
router.post("/register", register);

// @route POST /api/auth/login
router.post("/login",login);

router.get("/",getUsers)

export default router;

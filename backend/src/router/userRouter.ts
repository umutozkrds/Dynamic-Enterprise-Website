import express from "express";
import {
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);

export default router;

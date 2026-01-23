import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// ✅ DO NOT wrap controllers
// ✅ DO NOT call them manually
router.post("/register", register);
router.post("/login", login);

export default router;

import express from "express";
import {
  createPolicy,
  updatePolicy,
  getPolicy,
} from "../controllers/settingsController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createPolicy);
router.get("/:orgId", protect, getPolicy);
router.put("/:orgId", protect, adminOnly, updatePolicy);

export default router;

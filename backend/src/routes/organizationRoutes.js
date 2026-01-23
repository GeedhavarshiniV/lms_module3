import express from "express";
import {
  createOrganization,
  getOrganization,
  updateOrganization,
} from "../controllers/organizationController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createOrganization);
router.get("/:id", protect, getOrganization);
router.put("/:id", protect, adminOnly, updateOrganization);

export default router;

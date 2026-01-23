import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ==================== COURSE ROUTES ====================

// Create course (Trainer/Admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  createCourse
);

// Get all courses
router.get("/", authMiddleware, getCourses);

// Get course by ID with modules and lessons
router.get("/:id", authMiddleware, getCourseById);

// Update course (Trainer/Admin only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  updateCourse
);

// Publish/unpublish course (Trainer/Admin only)
router.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  toggleCourseStatus
);

// Delete course (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "SUPER_ADMIN"]),
  deleteCourse
);

// ==================== MODULE ROUTES ====================

// Create module in a course (Trainer/Admin only)
router.post(
  "/:courseId/modules",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  createModule
);

// Update module (Trainer/Admin only)
router.put(
  "/modules/:id",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  updateModule
);

// Delete module (Trainer/Admin only)
router.delete(
  "/modules/:id",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  deleteModule
);

// ==================== LESSON ROUTES ====================

// Create lesson in a module (Trainer/Admin only)
router.post(
  "/modules/:moduleId/lessons",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  createLesson
);

// Get lesson by ID
router.get("/lessons/:id", authMiddleware, getLessonById);

// Update lesson (Trainer/Admin only)
router.put(
  "/lessons/:id",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  updateLesson
);

// Delete lesson (Trainer/Admin only)
router.delete(
  "/lessons/:id",
  authMiddleware,
  roleMiddleware(["TRAINER", "ADMIN", "SUPER_ADMIN"]),
  deleteLesson
);

export default router;
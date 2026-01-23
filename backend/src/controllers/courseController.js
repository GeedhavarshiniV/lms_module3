import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";

// ==================== COURSE OPERATIONS ====================

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Trainer/Admin)
 */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      thumbnailUrl,
      tags,
      prerequisites,
      learningObjectives,
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      organizationId: req.user.organizationId,
      trainerId: req.user.userId,
      category,
      difficulty,
      duration,
      thumbnailUrl,
      tags,
      prerequisites,
      learningObjectives,
      status: "DRAFT",
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/courses
 * @desc    Get all courses (filtered by organization)
 * @access  Private
 */
export const getCourses = async (req, res) => {
  try {
    const { status, category, difficulty, search } = req.query;

    // Build filter
    const filter = { organizationId: req.user.organizationId };

    if (status) filter.status = status.toUpperCase();
    if (category) filter.category = category.toUpperCase();
    if (difficulty) filter.difficulty = difficulty.toUpperCase();
    if (search) {
      filter.$text = { $search: search };
    }

    const courses = await Course.find(filter)
      .populate("trainerId", "email role")
      .sort({ createdAt: -1 });

    res.json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID with modules and lessons
 * @access  Private
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "trainerId",
      "email role"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Get modules with lessons
    const modules = await Module.find({ courseId: id, isActive: true }).sort({
      order: 1,
    });

    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await Lesson.find({
          moduleId: module._id,
          isActive: true,
        }).sort({ order: 1 });

        return {
          ...module.toObject(),
          lessons,
        };
      })
    );

    res.json({
      course,
      modules: modulesWithLessons,
    });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private (Trainer/Admin)
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check if user is trainer or admin
    if (
      course.trainerId.toString() !== req.user.userId &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        message: "Not authorized to update this course",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/courses/:id/publish
 * @desc    Publish/unpublish course
 * @access  Private (Trainer/Admin)
 */
export const toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    course.status = status;
    await course.save();

    res.json({
      message: `Course ${status.toLowerCase()} successfully`,
      course,
    });
  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    res.status(500).json({
      message: "Failed to update course status",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course (soft delete)
 * @access  Private (Admin only)
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

// ==================== MODULE OPERATIONS ====================

/**
 * @route   POST /api/courses/:courseId/modules
 * @desc    Create a module in a course
 * @access  Private (Trainer/Admin)
 */
export const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order, duration } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Module title is required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const module = await Module.create({
      courseId,
      title,
      description,
      order: order || 0,
      duration,
    });

    res.status(201).json({
      message: "Module created successfully",
      module,
    });
  } catch (error) {
    console.error("CREATE MODULE ERROR:", error);
    res.status(500).json({
      message: "Failed to create module",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/modules/:id
 * @desc    Update module
 * @access  Private (Trainer/Admin)
 */
export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const module = await Module.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    res.json({
      message: "Module updated successfully",
      module,
    });
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);
    res.status(500).json({
      message: "Failed to update module",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/modules/:id
 * @desc    Delete module (soft delete)
 * @access  Private (Trainer/Admin)
 */
export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await Module.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    res.json({
      message: "Module deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);
    res.status(500).json({
      message: "Failed to delete module",
      error: error.message,
    });
  }
};

// ==================== LESSON OPERATIONS ====================

/**
 * @route   POST /api/modules/:moduleId/lessons
 * @desc    Create a lesson in a module
 * @access  Private (Trainer/Admin)
 */
export const createLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const {
      title,
      description,
      contentType,
      contentUrl,
      textContent,
      duration,
      order,
      isPreview,
    } = req.body;

    if (!title || !contentType) {
      return res.status(400).json({
        message: "Title and content type are required",
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    const lesson = await Lesson.create({
      moduleId,
      title,
      description,
      contentType: contentType.toUpperCase(),
      contentUrl,
      textContent,
      duration,
      order: order || 0,
      isPreview: isPreview || false,
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    res.status(500).json({
      message: "Failed to create lesson",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/lessons/:id
 * @desc    Get lesson by ID
 * @access  Private
 */
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.json({ lesson });
  } catch (error) {
    console.error("GET LESSON ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch lesson",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/lessons/:id
 * @desc    Update lesson
 * @access  Private (Trainer/Admin)
 */
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lesson = await Lesson.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.json({
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
    res.status(500).json({
      message: "Failed to update lesson",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/lessons/:id
 * @desc    Delete lesson (soft delete)
 * @access  Private (Trainer/Admin)
 */
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.json({
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    res.status(500).json({
      message: "Failed to delete lesson",
      error: error.message,
    });
  }
};
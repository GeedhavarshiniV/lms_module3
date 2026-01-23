import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: false,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["TECHNICAL", "SOFT_SKILLS", "COMPLIANCE", "OTHER"],
      default: "OTHER",
    },
    difficulty: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },
    duration: {
      type: Number, // in hours
      default: 0,
    },
    thumbnailUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    tags: [String],
    prerequisites: [String],
    learningObjectives: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for searching courses
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ organizationId: 1, status: 1 });
courseSchema.index({ trainerId: 1 });

export default mongoose.model("Course", courseSchema);
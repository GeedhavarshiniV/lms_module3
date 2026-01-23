import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure modules are ordered within a course
moduleSchema.index({ courseId: 1, order: 1 });

export default mongoose.model("Module", moduleSchema);
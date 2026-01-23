import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
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
    contentType: {
      type: String,
      enum: ["VIDEO", "PDF", "LINK", "TEXT", "QUIZ"],
      required: true,
    },
    contentUrl: {
      type: String, // URL for video, PDF, or external link
    },
    textContent: {
      type: String, // For text-based lessons
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isPreview: {
      type: Boolean, // Allow non-enrolled users to preview
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure lessons are ordered within a module
lessonSchema.index({ moduleId: 1, order: 1 });

export default mongoose.model("Lesson", lessonSchema);
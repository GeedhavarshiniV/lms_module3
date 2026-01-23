import mongoose from "mongoose";

const learningPolicySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    courseCompletionPercentage: {
      type: Number,
      default: 75,
    },

    assessmentPassPercentage: {
      type: Number,
      default: 50,
    },

    certificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LearningPolicy", learningPolicySchema);

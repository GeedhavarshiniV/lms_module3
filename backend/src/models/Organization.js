import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    address: String,
    contactEmail: String,
    contactPhone: String,
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    language: {
      type: String,
      default: "en",
    },

    // Branding
    logoUrl: String,
    themeColor: {
      type: String,
      default: "#2563eb",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);

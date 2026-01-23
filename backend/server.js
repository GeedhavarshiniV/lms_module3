import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();
connectDB();

const app = express();

// ✅ ADD THIS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// routes
import authRoutes from "./src/routes/authRoutes.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
// Add this line with your other routes
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/db-status", (req, res) => {
  res.json({
    state: mongoose.connection.readyState,
  });
});

export default router;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import db1 from "./config/db1.js";
import db2 from "./config/db2.js";

import gym from "./Gym/routes/index.js";
import aibak from "./Aibak/routes/index.js";
import errorHandler from "./Aibak/middleware/errorHandler.js";
import path from "path";


dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const __dirname = path.resolve();
// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/gym", gym);
app.use("/aibak", aibak);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV });
});

// Error handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

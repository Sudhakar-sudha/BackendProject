import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import  "./config/db1.js";
import  "./config/db2.js";

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

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "public")));
// Test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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
  console.log(`🚀 Server running on ${PORT}`);
});

import express from "express";
import  upload  from "../middleware/upload.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  addTrainer,
  getTrainers,
  updateTrainer,
  toggleActive,
  deleteTrainerPermanent,
  getTrainerById,
} from "../controllers/trainerController.js";

const router = express.Router();

// READ
router.get("/", getTrainers);
router.get("/:id", protect, getTrainerById);

// CREATE
router.post("/", protect, adminOnly, upload.single("file"), addTrainer);

// UPDATE
router.put("/:id", protect, adminOnly, upload.single("file"), updateTrainer);

// TOGGLE ACTIVE
router.patch("/:id/toggle-active", protect, adminOnly, toggleActive);

// DELETE
router.delete("/:id", protect, adminOnly, deleteTrainerPermanent);

export default router;

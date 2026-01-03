import express from "express";

import {
  createReservation,
  verifyPayment,
  getAllReservations,
  getReservationById,
  updateStatus,
} from "../controllers/reservationController.js";

const router = express.Router();

// Optional auth middleware later
// import { protect } from "../middleware/auth.js";

router.post("/", /* protect, */ createReservation);
router.post("/verify-payment", verifyPayment);
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id/status", updateStatus);

export default router;

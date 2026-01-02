import express from "express";
import {
  createBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User creates a booking
router.post("/", protect, createBooking);

// ✅ User fetches own bookings
router.get("/my", protect, getUserBookings);

// ✅ Admin fetches all bookings
router.get("/", protect, adminOnly, getBookings);

// ✅ Admin updates booking status
router.put("/:id", protect, adminOnly, updateBookingStatus);

export default router;

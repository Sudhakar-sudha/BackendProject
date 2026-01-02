import express from "express";

// Import all route files
import authRoutes from "./authRoutes.js";
import productRoutes from "./products.js";
import cartRoutes from "./CartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import trainerRoutes from "./trainerRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/bookings", bookingRoutes);
router.use("/trainers", trainerRoutes);
router.use("/payments",paymentRoutes);

export default router;

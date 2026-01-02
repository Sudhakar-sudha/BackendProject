import express from "express";
import { createOrder, getMyOrders , getAllOrders , updateOrderStatus } from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new order (Buy Now / Checkout)
router.post("/create", protect, createOrder);

// ✅ Get all orders for logged-in user
router.get("/my", protect, getMyOrders);




// Admin routes
router.get("/", protect, adminOnly, getAllOrders);  // ✅ Get all orders (admin only)
router.put("/:id/status", protect, adminOnly, updateOrderStatus); // Update order status

export default router;

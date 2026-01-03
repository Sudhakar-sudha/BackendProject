import express from "express";

import {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
  getUserOrders,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// 🟢 Create a Razorpay order
router.post("/payment/create", createRazorpayOrder);

// 🟢 Verify payment & place final order
router.post("/payment/verify", verifyPaymentAndPlaceOrder);

// 🟢 Get all orders for a specific user
router.get("/user/:userId", getUserOrders);

// 🟢 Cancel an order by ID
router.put("/cancel/:id", cancelOrder);

export default router;

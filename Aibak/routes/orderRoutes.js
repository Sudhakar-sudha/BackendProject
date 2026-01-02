import express from "express";
import orderController from "../controllers/orderController.js";

const router = express.Router();

// 🟢 Create a Razorpay order (frontend uses this to get order_id & key)
router.post("/payment/create", orderController.createRazorpayOrder);

// 🟢 Verify payment & place final order
router.post("/payment/verify", orderController.verifyPaymentAndPlaceOrder);

// 🟢 Get all orders for a specific user
router.get("/user/:userId", orderController.getUserOrders);

// 🟢 Cancel an order by ID
router.put("/cancel/:id", orderController.cancelOrder);

export default router;

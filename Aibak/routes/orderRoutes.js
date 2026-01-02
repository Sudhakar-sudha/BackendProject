const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// 🟢 Create a Razorpay order (frontend uses this to get order_id & key)
router.post("/payment/create", orderController.createRazorpayOrder);

// 🟢 Verify payment & place final order
router.post("/payment/verify", orderController.verifyPaymentAndPlaceOrder);

// 🟢 Get all orders for a specific user
router.get("/user/:userId", orderController.getUserOrders);

// 🟢 Cancel an order by ID
router.put("/cancel/:id", orderController.cancelOrder);

module.exports = router;

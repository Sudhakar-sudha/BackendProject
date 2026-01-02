import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import Payment from "../models/Payment.js";


// 🟢 initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
// console.log(process.env.RAZORPAY_KEY_ID);
// console.log(process.env.RAZORPAY_SECRET);
/**
 * 1️⃣ Create Razorpay Order
 *    Frontend calls this to get order_id and amount.
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR
    // console.log(amount);
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
// console.log(options);
    const razorpayOrder = await razorpay.orders.create(options);
    // console.log(razorpayOrder);
    // store initial payment record
    await Payment.create({
      razorpay_order_id: razorpayOrder.id,
      amount,
      currency: "INR",
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // send key for frontend checkout
    });
  } catch (err) {
    console.error("❌ createRazorpayOrder error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

/**
 * 2️⃣ Verify Payment & Place Final Order
 *    Called by frontend after successful Razorpay payment.
 */
export const verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      address,
      paymentMethod,
    } = req.body;

    // If COD, skip verification and directly place order
    if (paymentMethod === "COD") {
      return await placeOrder(userId, address, paymentMethod, null, res);
    }

    // Signature verification
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "Completed",
      },
      { new: true }
    );

    // Create actual order in DB
    return await placeOrder(
      userId,
      address,
      "Online",
      { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      res
    );
  } catch (err) {
    console.error("❌ verifyPaymentAndPlaceOrder error:", err);
    res.status(500).json({ message: "Failed to process payment" });
  }
};

/**
 * Helper: Place order from user's cart
 */
const placeOrder = async (userId, address, paymentMethod, paymentInfo, res) => {
  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let subtotal = 0;
  const orderItems = cart.items.map((item) => {
    subtotal += item.menuItem.price * item.quantity;
    return {
      menuItem: item.menuItem._id,
      quantity: item.quantity,
      price: item.menuItem.price,
    };
  });

  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const order = new Order({
    user: new mongoose.Types.ObjectId(userId),
    items: orderItems,
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    status: paymentMethod === "COD" ? "Pending" : "Completed",
    address,
    paymentInfo,
  });
// console.log(order);
  await order.save();

  // clear cart after placing order
  await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

  return res.status(200).json({ message: "Order placed successfully", order });
};

/**
 * Other endpoints: get user orders, cancel order etc.
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.menuItem").populate("user", "name email");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

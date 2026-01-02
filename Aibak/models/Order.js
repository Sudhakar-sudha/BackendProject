import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const orderSchema = new mongoose.Schema(
  {

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 30 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Debit", "Credit", "COD", "UPI", "Online"], required: true },
    status: { type: String, default: "Pending" }, // Pending, Completed, Cancelled
    address: { type: String }, // shipping / delivery address
    paymentInfo: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
  },
  { timestamps: true }
);

const Order =
  db1.models.Order || db1.model("Order", orderSchema);

export default Order;
import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  },
  { timestamps: true }
);

const Payment =
  db1.models.Payment || db1.model("Payment", paymentSchema);

export default Payment;
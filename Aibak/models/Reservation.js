import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },     // e.g. "2025-09-18"
    time: { type: String, required: true },     // e.g. "18:30"
    hours: { type: Number, required: true, min: 1, max: 3 },
    seats: { type: Number, required: true, min: 2, max: 10 },
    type: { type: String, enum: ["AC", "Non-AC"], required: true },
    note: { type: String, default: "" },

    payment: { type: String, enum: ["UPI", "Card", "Cash on arrival"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },

    // Razorpay IDs (only if online payment)
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    // Derived amounts
    seatCharge: { type: Number, required: true },
    acCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    advance: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Reservation =
  db1.models.Reservation || db1.model("Reservation", reservationSchema);

export default Reservation;
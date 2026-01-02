import mongoose from "mongoose";
import db2 from "../../config/db2.js";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
    email: String,
    phone: String,
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    trainerName: String,
    fees: Number,
    timing: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking =
  db2.models.Booking || db2.model("Booking", bookingSchema);

export default Booking;
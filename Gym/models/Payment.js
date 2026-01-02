import mongoose from "mongoose";
import  db2  from "../../config/db2.js";

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_id: {
      type: String,
      required: true,
    },
    plan_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    screenshot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "notpaid"],
      default: "paid",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Payment =
  db2.models.Payment || db2.model("Payment", paymentSchema);

export default Payment;
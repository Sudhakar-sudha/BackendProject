import mongoose from "mongoose";
import  db2  from "../../config/db2.js";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: Array,
    address: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order =
  db2.models.Order || db2.model("Order", orderSchema);

export default Order;
import mongoose from "mongoose";
import  db2  from "../../config/db2.js";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: Number,
    price: Number,
    productname: String,
    image: String,
  },
  { timestamps: true }
);

const Cart =
  db2.models.Cart || db2.model("Cart", cartSchema);

export default Cart;
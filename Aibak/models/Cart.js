import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const cartItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

const Cart =
  db1.models.Cart || db1.model("Cart", cartSchema);

export default Cart;
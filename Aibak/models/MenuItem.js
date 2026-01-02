import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const menuItemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: String,
    imagePublicId: String,
  },
  { timestamps: true }
);


const MenuItem =
  db1.models.MenuItem || db1.model("MenuItem", menuItemSchema);

export default MenuItem;
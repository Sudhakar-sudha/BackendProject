import mongoose from "mongoose";
import  db2  from "../../config/db2.js";

const productSchema = new mongoose.Schema(
  {
    productname: String,
    description: String,
    price: Number,
    image: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product =
  db2.models.Product || db2.model("Product", productSchema);

export default Product;
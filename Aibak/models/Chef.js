import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const ChefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    signature: { type: String, required: true },
    imageUrl: String,
    publicId: String,
  },
  { timestamps: true }
);

const Chef =
  db1.models.Chef || db1.model("Chef", ChefSchema);

export default Chef;
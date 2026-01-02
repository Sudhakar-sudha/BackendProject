import  db2  from "../../config/db2.js";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User =
  db2.models.User || db2.model("User", userSchema);

export default User;
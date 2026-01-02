import mongoose from "mongoose";
import  db1  from "../../config/db1.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  address: { type: String },

  // 👇 new field
  role: {
    type: String,
    enum: ["user", "admin"],  // restrict values
    default: "user"           // default role
  },
  otp: {
    type: String, // Store OTP as a string to avoid numeric truncation
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },


}, {
  timestamps: true
});

const User =
  db1.models.User || db1.model("User", userSchema);

export default User;
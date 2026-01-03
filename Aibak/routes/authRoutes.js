import express from "express";
import { body } from "express-validator";

import {
  register,
  login,
  sendOtp,
  resendOtp,
  verifyOtp,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

const router = express.Router();

// ================= REGISTER =================
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Valid email required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("address").optional().trim(),
  ],
  register
);

// ================= AUTH =================
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  login
);

// ================= OTP =================
router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);

// ================= USERS =================
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;

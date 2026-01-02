import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import moment from "moment";

import User from "../models/User.js";
import { sendEmail } from "../../utils/emailTransporter.js";

// Helper: 6-digit OTP as string
function generateSixDigitToken() {
  return crypto.randomInt(100000, 1000000).toString();
}

// ======================= REGISTER (with OTP email) =======================
export const register = async (req, res) => {
  try {
    const { name, username, email, phone, password, address } = req.body;

    if (!name || !username || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check duplicates (email OR username)
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      if (existing.email === email)
        return res.status(400).json({ message: 'Email already registered' });
      if (existing.username === username)
        return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // create user with OTP + expiry
    const otp = generateSixDigitToken();
    const otpExpires = moment().add(5, 'minutes').toDate();

    const user = new User({
      name,
      username,
      email,
      phone,
      password: hashed,
      address,
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();

    // send OTP email
    await sendEmail({
      to: email,
      subject: 'Verify your email - OTP',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>
             <p>This code will expire in 5 minutes.</p>`,
    });

    // Do not log password or OTP in production!
    res.status(201).json({
      message: 'User registered. OTP sent to email.',
      userId: user._id,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ======================= SEND OTP AGAIN (manual trigger) =======================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'User already verified' });

    const otp = generateSixDigitToken();
    user.otp = otp;
    user.otpExpires = moment().add(5, 'minutes').toDate();
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>
             <p>This code will expire in 5 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ======================= RESEND OTP =======================
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified)
      return res.status(400).json({ message: 'User already verified' });

    const otp = generateSixDigitToken();
    user.otp = otp;
    user.otpExpires = moment().add(5, 'minutes').toDate();
    // console.log(user);
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Resend OTP for Verification',
      html: `<p>Your new OTP is: <strong>${otp}</strong></p>
             <p>This code will expire in 5 minutes.</p>`,
    });

    res.status(200).json({"success": true, message: 'New OTP sent to email' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ======================= VERIFY OTP =======================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.otp || !user.otpExpires)
      return res.status(400).json({ message: 'No OTP requested' });

    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // Issue JWT after successful verification
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.status(200).json({
      "success": true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ "success": false, message: 'Server error', error: err.message });
  }
};

// ======================= LOGIN =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




/**
 * GET /api/users
 * Return all users except password
 */
export const getAllUsers = async (req, res) => {
  try {
    // Exclude password field
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user by id
 */
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    // console.log(deleted);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/**
 * GET /api/users/:id
 * Get a single user by ID (excluding password)
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * PUT /api/users/:id
 * Update a user (name, email, phone, address, role, etc.)
 */
export const updateUser = async (req, res) => {
  try {
    const updates = (({ name, email, phone, address, role }) => 
      ({ name, email, phone, address, role }))(req.body);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true, select: "-password" }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
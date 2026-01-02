import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Protect Route (User Authentication)
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check token from cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // ✅ OR Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET2);

    // Fetch user from MongoDB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// 🔐 Admin-only middleware
export const adminOnly = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    await protect(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

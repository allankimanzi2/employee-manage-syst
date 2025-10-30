import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config(); // ✅ make sure .env variables are loaded

const router = express.Router();

// 🧠 DEBUG: Show when the route file is loaded
console.log("Auth routes loaded ✅");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "❌ Missing");

// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      success: true, // ✅ Add this
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;


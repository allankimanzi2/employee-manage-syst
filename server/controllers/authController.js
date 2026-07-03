import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    console.log("\n========== LOGIN REQUEST ==========");
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    // Show all users currently in the database
    const users = await User.find({}, "name email role");
    console.log("Users in database:", users);

    // Find the requested user
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);

      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    console.log(`✅ User found: ${user.email}`);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Invalid password");

      return res.status(401).json({
        success: false,
        error: "Invalid Password",
      });
    }

    console.log("✅ Password matched");

    // Generate JWT
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "10d",
      }
    );

    console.log("✅ Login successful");

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const verify = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export { login, verify };
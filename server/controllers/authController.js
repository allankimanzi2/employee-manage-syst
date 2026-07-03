import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    console.log("========== LOGIN REQUEST ==========");
    console.log("Body:", req.body);

    const users = await User.find({}, "name email role");
    console.log("Users in database:", users);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    console.log("User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password incorrect");
      return res.status(401).json({
        success: false,
        error: "Invalid Password",
      });
    }

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

    console.log("Login successful");

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
    console.error("LOGIN ERROR:", error);

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
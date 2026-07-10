import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Franchise from "../models/franchise.model.js";

export const loginFranchise = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const franchise = await Franchise.findOne({
      email: email.toLowerCase(),
    });

    if (!franchise) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (franchise.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    const isMatch = await bcrypt.compare(password, franchise.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
  {
    id: franchise._id,
    company: franchise.company,
    role: "franchise",
    franchise: franchise._id,
    locationId: franchise._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);
    franchise.lastLogin = new Date();
    await franchise.save();

    const franchiseData = franchise.toObject();
    delete franchiseData.password;
    franchiseData.locationId = franchise._id;
franchiseData.franchise = franchise._id;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      franchise: franchiseData,
    });
  } catch (error) {
    console.error("Franchise Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
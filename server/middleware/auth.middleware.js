import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const buildSafeUser = (user) => ({
  id: String(user._id),
  company: String(user.company),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    req.user = buildSafeUser(user);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication is required" });
  }

  if (roles.length && !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to access this resource" });
  }

  next();
};

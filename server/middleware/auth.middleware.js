import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const buildSafeUser = (user) => ({
  _id: String(user._id),
  id: String(user._id),
  company: String(user.company?._id || user.company),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status?.value || "active",
  isEmailVerified: Boolean(user.isEmailVerified),
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

    if (decoded.type && decoded.type !== "access") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const user = await User.findById(decoded.id).select("-password +tokenVersion");

    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    if (user.status?.value === "inactive") {
      return res.status(403).json({ message: "User account is inactive" });
    }

    if (
      process.env.REQUIRE_EMAIL_VERIFICATION === "true" &&
      !user.isEmailVerified
    ) {
      return res.status(403).json({ message: "Email verification is required" });
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

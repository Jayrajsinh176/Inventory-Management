import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/users.model.js";
import Company from "../models/company.model.js";

const validRoles = ["admin", "staff"];


const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      company: String(user.company),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

const buildUserResponse = (user) => ({
  id: user._id,
  company: String(user.company),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

const getDuplicateFieldMessage = (error) => {
  const field = Object.keys(error.keyValue || {})[0];

  if (!field) {
    return "Record already exists";
  }

  return `${field} already exists`;
};

const getValidationMessages = (error) =>
  Object.values(error.errors || {}).map((item) => item.message);

/**
 * @description Register a new user or create a new company with its first admin.
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  let company = null;
  let user = null;

  try {
  

    let { company_name, name, email, phone, password, address, role } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    role = role?.trim().toLowerCase();

    if (!company_name || !address || !name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Role must be either "admin" or "staff"',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    }).lean();

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "Email already exists" : "Phone already exists",
      });
    }

    
    let resolvedRole = role || "staff";

  
    company_name = company_name?.trim();
    address = address?.trim();
    if (!company_name || !address) {
      return res.status(400).json({
        message: "Company name and address are required.",
      });
    }
    const existingCompany = await Company.findOne({
      $or: [{ email: email }, { phone: phone }],
    }).lean();
    if (existingCompany) {
      return res.status(400).json({
        message: existingCompany.email === email ? "Company email already exists" : "Company phone already exists",
      });
    }
    company = await Company.create({
      company_name: company_name,
      email: email,
      phone: phone,
      address: address,
    });

    user = await User.create({
      company: company._id,
      name: name,
      email: email,
      phone: phone,
      password,
      role: "admin",
    });

    return res.status(201).json({
      message: company ? "Account created successfully" : "User registered successfully",
      user: buildUserResponse(user),
      token: generateToken(user),
      ...(company && {
        company: {
          id: company._id,
          company_name: company.company_name,
        },
      }),
    });
  } catch (error) {
    if (company?._id && !user?._id) {
      await Company.findByIdAndDelete(company._id).catch(() => null);
    }

    if (error.name === "ValidationError") {
      const messages = getValidationMessages(error);
      return res.status(400).json({
        message: messages[0] || "Validation failed",
        errors: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: getDuplicateFieldMessage(error),
      });
    }



    // console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * @description Authenticate an existing user.
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    let { email, phone, password } = req.body;

    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    const query = email && phone
      ? { $or: [{ email: email }, { phone: phone }] }
      : email
        ? { email: email }
        : { phone: phone };

    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: buildUserResponse(user),
      token: generateToken(user),
    });
  } catch (error) {
    if (error.message === "JWT_SECRET is not configured") {
      return res.status(500).json({
        message: "JWT secret is not configured",
      });
    }

    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

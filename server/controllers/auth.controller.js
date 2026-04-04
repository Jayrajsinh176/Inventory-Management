import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/users.model.js";
import Company from "../models/company.model.js";

const validRoles = ["admin", "staff"];

const getCompanyId = (company) => String(company?._id ?? company ?? "");


const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      company: getCompanyId(user.company),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

const buildUserResponse = (user) => ({
  id: user._id,
  company: getCompanyId(user.company),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});
const buildCompanyResponse = (company) => ({
  id: company._id,
  company_name: company.company_name,
  email: company.email,
  phone: company.phone,
  address: company.address,
  plan: company.plan,
  subscription_start_date: company.subscription_start_date,
  subscription_end_date: company.subscription_end_date
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
    company_name = company_name?.trim();
    address = address?.trim();
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    role = role?.trim().toLowerCase();

    if (!company_name || !address || !name || !email || !phone || !password) {
      return res.status(400).json({
        success : false,
        message: "All Fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success : false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    }).lean();

    if (existingUser) {
      return res.status(400).json({
        success : false,
        message: existingUser.email === email ? "Email already exists" : "Phone already exists",
      });
    }

    const existingCompany = await Company.findOne({
      $or: [{ email: email }, { phone: phone }],
    }).lean();

    if (existingCompany) {
      return res.status(400).json({
        success : false,
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
      success : true,
      message: company ? "Account created successfully" : "User registered successfully",
      user: buildUserResponse(user),
      token: generateToken(user),
      company:buildCompanyResponse(company),
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
    return res.status(500).json({ 
      success : false,
      message: "Internal server error" 
    });
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
        success : false,
        message: "Email or phone and password are required",
      });
    }

    const query = email && phone
      ? { $or: [{ email: email }, { phone: phone }] }
      : email
        ? { email: email }
        : { phone: phone };

    const user = await User.findOne(query).select("+password").populate("company");

    if (!user) {
      return res.status(401).json({ 
        success : false,
        message: "Invalid email or password" 
      });
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({ 
        success : false,
        message: "Invalid email or password" 
      });
    }

    return res.status(200).json({
      success : true,
      message: "Login successful",
      user: buildUserResponse(user),
      token: generateToken(user),
      company:buildCompanyResponse(user.company),
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

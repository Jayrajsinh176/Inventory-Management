import Company from "../models/company.model.js";
// import User from "../models/users.model.js";
// import Subscription from "../models/subscription.model.js";
// import Product from "../models/product.model.js";
// import Order from "../models/order.model.js";

import Franchise from "../models/franchise.model.js";
import {
  canAddLocationToPlan,
  formatPlanLocationLimit,
} from "../utils/subscription.js";

const generatePassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return password;
};



export const createFranchise = async (req, res) => {
  try {
    const {
      company_name,
      name,
      email,
      phone,
      address,
      gstNumber,
    } = req.body;

    // ===========================
    // Validation
    // ===========================

    if (!company_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Manager name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location address is required",
      });
    }

    // ===========================
    // Company Check
    // ===========================

    const company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ===========================
    // Business Plan Check
    // ===========================

    if (company.plan !== "Business") {
      return res.status(403).json({
        success: false,
        message: "Only Business plan users can create locations.",
      });
    }

    // ===========================
    // Location Limit
    // ===========================

    const currentLocations = await Franchise.countDocuments({
      company: req.user.company,
    });

    if (!canAddLocationToPlan(company.plan, currentLocations + 1)) {
      return res.status(400).json({
        success: false,
        message: `Your ${company.plan} plan allows up to ${formatPlanLocationLimit(
          company.plan
        )} locations.`,
      });
    }

    // ===========================
    // Duplicate Email
    // ===========================

    const emailExists = await Franchise.findOne({
      company: req.user.company,
      email: email.toLowerCase(),
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // ===========================
    // Duplicate Phone
    // ===========================

    const phoneExists = await Franchise.findOne({
      company: req.user.company,
      phone,
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // ===========================
    // Create Location
    // ===========================

    const location = await Franchise.create({
      company: req.user.company,
      company_name: company_name.trim(),
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
      address: address.trim(),
      gstNumber: gstNumber?.trim() || "",
      isDefault: currentLocations === 0,
    });

    // ===========================
    // Response
    // ===========================

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      location,
    });

  } catch (error) {
    console.error("Create Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFranchises = async (req, res) => {
  try {
    const franchises = await Franchise.find({
      company: req.user.company,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      franchises,
    });
  } catch (error) {
    console.error("Get Locations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFranchiseById = async (req, res) => {
  try {
    const location = await Franchise.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      location,
    });

  } catch (error) {
    console.error("Get Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateFranchise = async (req, res) => {
  try {
    const {
      company_name,
      name,
      email,
      phone,
      address,
      gstNumber,
    } = req.body;

    // ===========================
    // Validation
    // ===========================

    if (!company_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Manager name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location address is required",
      });
    }

    // ===========================
    // Find Location
    // ===========================

    const location = await Franchise.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // ===========================
    // Duplicate Email
    // ===========================

    const emailExists = await Franchise.findOne({
      company: req.user.company,
      email: email.toLowerCase(),
      _id: { $ne: location._id },
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // ===========================
    // Duplicate Phone
    // ===========================

    const phoneExists = await Franchise.findOne({
      company: req.user.company,
      phone,
      _id: { $ne: location._id },
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // ===========================
    // Update Location
    // ===========================

    location.company_name = company_name.trim();
    location.name = name.trim();
    location.email = email.toLowerCase();
    location.phone = phone;
    location.address = address.trim();
    location.gstNumber = gstNumber?.trim() || "";

    await location.save();

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location,
    });

  } catch (error) {
    console.error("Update Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const toggleFranchiseStatus = async (req, res) => {
  try {
    // ===========================
    // Find Location
    // ===========================

    const location = await Franchise.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // ===========================
    // Toggle Status
    // ===========================

    location.status =
      location.status === "active"
        ? "inactive"
        : "active";

    await location.save();

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message:
        location.status === "active"
          ? "Location activated successfully."
          : "Location deactivated successfully.",
      status: location.status,
    });

  } catch (error) {
    console.error("Toggle Location Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getFranchiseLocations = async (req, res) => {
  try {
    const locations = await Franchise.find({
      company: req.user.company,
    })
    .select("company_name name email phone")
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      locations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
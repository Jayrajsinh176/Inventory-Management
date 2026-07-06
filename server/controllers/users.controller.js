import mongoose from "mongoose";
import User from "../models/users.model.js";
import Company from "../models/company.model.js";
import Activity from "../models/activity.model.js";
import Franchise from "../models/franchise.model.js";
// import subscription from "../utils/subscription.js";

import {
  canAddUsersToPlan,
  formatPlanUsersLimit,
} from "../utils/subscription.js";
import { logActivity } from "../utils/logActivity.js";

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const handleStaffError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map(
      (item) => item.message,
    );
    return res.status(400).json({
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: "User already exists for this company",
    });
  }

  console.error("Staff error:", error);
  return res.status(500).json({ message: "Internal server error" });
};
/**
 * @description get all user details
 * @route GET /api/user
 * @access Protected
 */
export const getUsersDetails = async (req, res) => {
  try {
   const users = await User.find({
  company: req.user.company,
})
  .populate("locationId", "name")
  .select("-password")
  .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description get single user by ID
 * @route GET /api/user/:id
 * @access Protected
 */
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

  const user = await User.findOne({
  _id: userId,
  company: req.user.company,
})
  .populate("locationId", "name")
  .select("-password")
  .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description add user
 * @route POST /api/user
 * @access Protected
 */
export const addUsers = async (req, res) => {
  try {
    const companyPlanDetails = await Company.findById(req.user.company).select(
      "plan",
    );
    if (!companyPlanDetails) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const users = await User.find({
      company: req.user.company,
    })
      .select("-password")
      .lean();

    if (canAddUsersToPlan(companyPlanDetails.plan, users.length)) {
    let { name, email, phone, role, locationId } = req.body;
      name = name?.trim();
      email = email?.trim().toLowerCase();
      phone = phone?.trim();
      role = role?.trim().toLowerCase();

      if (!email && !phone) {
        return res.status(400).json({
          success: false,
          message: "Email or Phone is required.",
        });
      }

      if (!name || (!email && !phone) || !role) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

    if (!["admin", "manager", "staff"].includes(role)) {
  return res.status(400).json({
    success: false,
    message: "Invalid role.",
  });
  // Only one Admin is allowed per company
if (role === "admin") {
  const existingAdmin = await User.findOne({
    company: req.user.company,
    role: "admin",
  });

  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: "Only one Admin is allowed per company.",
    });
  }
}

}

if (companyPlanDetails.plan !== "Business" && role === "manager") {
  return res.status(403).json({
    success: false,
    message: "Manager role is available only in the Business plan.",
  });
}

if (companyPlanDetails.plan === "Business") {
  if (role !== "admin" && !locationId) {
    return res.status(400).json({
      success: false,
      message: "Location is required.",
    });
  }

  if (locationId) {
    const location = await Franchise.findOne({
      _id: locationId,
      company: req.user.company,
    });

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Invalid location.",
      });
    }
  }
}

      const existingEmail = users.find((user) => user.email === email);
      const existingPhone = users.find((user) => user.phone === phone);

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists.",
        });
      }

      const generatedPassword = generatePassword();
      const user = await User.create({
  company: req.user.company,
  locationId: locationId || null,
  name,
  email,
  phone,
  password: generatedPassword,
  role,
});

      const safeUser = await User.findById(user._id).select("-password").lean();

      await logActivity({
        userId: req.user._id,
        companyId: req.user.company,
        action: "added_user",
        details: `Added user: ${name}`,
        metadata: {
          newUserId: user._id,
          name,
          email,
          phone,
          role,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Staff added successfully.",
        data: safeUser,
        tempPassword: generatedPassword,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `You have reached the limit of ${formatPlanUsersLimit(companyPlanDetails.plan)} users.`,
      });
    }
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description update user details
 * @route PUT /api/user/:id
 * @access Protected
 */
export const updateUsersDetails = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }

    let { name, email, phone, role, locationId } = req.body;
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    role = role?.trim().toLowerCase();

    const companyPlanDetails = await Company.findById(req.user.company).select("plan");

if (!companyPlanDetails) {
  return res.status(404).json({
    success: false,
    message: "Company not found.",
  });
}

    if (!name && !email && !phone && !role) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update.",
      });
    }
if (role) {
  if (!["admin", "manager", "staff"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role.",
    });
  }

  if (companyPlanDetails.plan !== "Business" && role === "manager") {
    return res.status(403).json({
      success: false,
      message: "Manager role is available only in the Business plan.",
    });
  }
}

// Only one Admin is allowed per company
if (role === "admin") {
  const existingAdmin = await User.findOne({
    company: req.user.company,
    role: "admin",
    _id: { $ne: id }, // Ignore current user
  });

  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: "Only one Admin is allowed per company.",
    });
  }
}

if (companyPlanDetails.plan === "Business") {
  if (role !== "admin" && !locationId) {
    return res.status(400).json({
      success: false,
      message: "Location is required.",
    });
  }

  if (locationId) {
    const location = await Franchise.findOne({
      _id: locationId,
      company: req.user.company,
    });

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Invalid location.",
      });
    }
  }
}

    const user = await User.findOneAndUpdate(
      

      {
        _id: id,
        company: req.user.company,
      },
      {
      $set: {
  name,
  email,
  phone,
  role,
  locationId: role === "admin" ? null : locationId,
},
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    const changedFields = {};
    if (name) changedFields.name = name;
    if (email) changedFields.email = email;
    if (phone) changedFields.phone = phone;
    if (role) changedFields.role = role;

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "updated_user",
      details: `Updated user: ${user.name}`,
      metadata: {
        targetUserId: id,
        updatedFields: changedFields,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Staff details updated successfully.",
      data: user,
    });
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description deactivate user
 * @route PATCH /api/user/:id/deactivate
 * @access Protected
 */

export const deactivateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    const user = await User.findOne({
      _id: id,
      company: req.user.company,
    })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    if (user.status.value === "active") {
      await User.findByIdAndUpdate(id, {
        $set: {
          "status.value": "inactive",
          "status.deactivatedAt": new Date(),
          "status.deactivatedBy": req.user._id,
        },
      });

      // Log activity
      await logActivity({
        userId: req.user._id,
        companyId: req.user.company,
        action: "deactivated_user",
        details: `Deactivated user: ${user.name}`,
        metadata: {
          targetUserId: id,
          targetUserName: user.name,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Staff deactivated successfully.",
      });
    }
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description activate user
 * @route PATCH /api/user/:id/activate
 * @access Protected
 */

export const activateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    const user = await User.findOne({
      _id: id,
      company: req.user.company,
    })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    if (user.status.value === "inactive") {
      await User.findByIdAndUpdate(id, {
        $set: {
          "status.value": "active",
          "status.reactivatedAt": new Date(),
          "status.reactivatedBy": req.user._id,
        },
      });

      // Log activity
      await logActivity({
        userId: req.user._id,
        companyId: req.user.company,
        action: "reactivated_user",
        details: `Reactivated user: ${user.name}`,
        metadata: {
          targetUserId: id,
          targetUserName: user.name,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Staff activated successfully.",
      });
    }
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description delete user
 * @route DELETE /api/user/:id
 * @access Protected
 */
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    const user = await User.findOneAndDelete({
      _id: id,
      company: req.user.company,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "deleted_user",
      details: `Deleted user: ${user.name}`,
      metadata: {
        deletedUserId: id,
        deletedUserName: user.name,
        deletedUserEmail: user.email,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Staff deleted successfully.",
    });
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description get user activity log with pagination
 * @route GET /api/users/:id/activity
 * @access Protected
 */
export const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }

    const user = await User.findOne({
      _id: id,
      company: req.user.company,
    }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      user: id,
      company: req.user.company,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const count = await Activity.countDocuments({
      user: id,
      company: req.user.company,
    });

    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      action: activity.action,
      details: activity.details,
      timestamp: activity.createdAt,
      metadata: activity.metadata,
    }));

    return res.status(200).json({
      success: true,
      activities: formattedActivities,
      pagination: {
        count: formattedActivities.length,
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get user activity error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

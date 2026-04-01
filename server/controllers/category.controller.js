import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Company from "../models/company.model.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const handleCategoryError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map(
      (item) => item.message
    );
    return res.status(400).json({
      success: false,
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Category already exists for this company",
    });
  }

  console.error("Category error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

/**
 * @description Get all categories for a company
 * @route GET /api/category
 * @access Protected
 */

export const getCategory = async (req, res) => {
  try {
    const companyId = req.user.company;

    const categories = await Category.aggregate([
      {
        $match: { company: new mongoose.Types.ObjectId(companyId) }
      },
      {
        $lookup: {
          from: "products", // collection name (IMPORTANT)
          localField: "_id",
          foreignField: "category",
          as: "products"
        }
      },
      {
        $addFields: {
          productCount: { $size: "$products" }
        }
      },
      {
        $project: {
          products: 0 // remove full product array (important for performance)
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map((c) => ({
        id: c._id,
        name: c.name,
        company: c.company,
        productCount: c.productCount,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });

  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Create category
 * @route POST /api/category
 * @access Protected
 */
export const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    // Type validation
    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    // Normalize
    name = name.trim().toLowerCase();

    // Empty check
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Length validation
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    // Create (rely on DB unique index)
    const category = await Category.create({
      company: req.user.company,
      name,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Update category
 * @route PUT /api/category/:id
 * @access Protected
 */
export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    let { name } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    name = name.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      {
        _id: id,
        company: req.user.company,
      },
      { $set: { name } },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Delete category
 * @route DELETE /api/category/:id
 * @access Protected
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    const deleted = await Category.findOneAndDelete({
      _id: id,
      company: req.user.company,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};
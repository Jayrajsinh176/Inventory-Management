import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Company from "../models/company.model.js";
import {
  canAddProductToPlan,
  formatPlanProductLimit,
  getSubscriptionPlan,
} from "../utils/subscription.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const escapeRegex = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const buildProductPayload = (product) => ({
  id: product._id,
  company: product.company,
  name: product.name,
  sku: product.sku,
  category: product.category,
  price: product.price,
  stock: product.stock,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const handleProductError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map((item) => item.message);
    return res.status(400).json({
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: "SKU already exists for this company",
    });
  }

  console.error("Product error:", error);
  return res.status(500).json({ message: "Internal server error" });
};

const getScopedCategory = async (categoryId, companyId) => {
  if (!isValidObjectId(categoryId)) {
    return null;
  }

  return Category.findOne({
    _id: categoryId,
    company: companyId,
  }).select("_id name");
};

/** 
 * @description get all products for company
 * @route GET /api/products
 * @access Protected
 */
export const getProducts = async (req, res) => {
  try {
    const query = { company: req.user.company };

    if (req.query.category) {
      if (!isValidObjectId(req.query.category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }

      query.category = req.query.category;
    }

    if (req.query.search?.trim()) {
      const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), "i");
      query.$or = [{ name: searchRegex }, { sku: searchRegex }];
    }

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(page*limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: products.length,
      products: products.map(buildProductPayload),
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        success : false,
        message: "Invalid product id" 
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).populate("category", "name").lean();

    if (!product) {
      return res.status(404).json({ 
        success : false,
        message: "Product not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: buildProductPayload(product),
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/**
 * @description create product for company
 * @route POST /api/products
 * @access Protected
 */
export const createProduct = async (req, res) => {
  try {
    let { name, sku, category, price, stock } = req.body;

    name = name?.trim();
    sku = sku?.trim().toUpperCase();

    if (!name || !sku || !category || price === undefined) {
      return res.status(400).json({
        success : false,
        message: "Name, SKU, category, and price are required",
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({ 
        success : false,
        message: "Invalid category id" 
      });
    }
    if (typeof price !== "number") {
      return res.status(400).json({ 
        success : false,
        message: "Price must be a number" 
      });
    }

    if (stock !== undefined && typeof stock !== "number") {
      return res.status(400).json({ 
        success : false,
        message: "Stock must be a number" 
      });
    }
    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({ 
        success : false,
        message: "Company not found" 
      });
    }

    const productCount = await Product.countDocuments({ company: req.user.company });
    if (!canAddProductToPlan(company.plan, productCount)) {
      const plan = getSubscriptionPlan(company.plan);
      return res.status(403).json({
        success : false,
        message: `${plan.label} plan allows up to ${formatPlanProductLimit(company.plan)} products. Upgrade your plan to add more products.`,
      });
    }

    const existingCategory = await getScopedCategory(category, req.user.company);
    if (!existingCategory) {
      return res.status(404).json({ 
        success : false,
        message: "Category not found for this company" 
      });
    }

    const product = await Product.create({
      company: req.user.company,
      name,
      sku,
      category,
      price,
      stock: stock ?? 0,
    });

    await product.populate("category", "name");

    return res.status(201).json({
      success : true,
      message: "Product created successfully",
      product: buildProductPayload(product),
      subscription: {
        plan: company.plan,
        maxProducts: formatPlanProductLimit(company.plan),
      },
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/** 
 * @description update product 
 * @route PUT /api/products/:id
 * @access Protected 
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Find product (multi-tenant safe)
    const product = await Product.findOne({
      _id: id,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = ["name", "sku", "category", "price", "stock"];
    const updateFields = Object.keys(req.body).filter((field) =>
      allowedFields.includes(field)
    );

    if (!updateFields.length) {
      return res.status(400).json({
        message: "At least one valid field is required to update the product",
      });
    }

    const { name, sku, category, price, stock } = req.body;

    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }

      const existingCategory = await getScopedCategory(
        category,
        req.user.company
      );

      if (!existingCategory) {
        return res
          .status(404)
          .json({ message: "Category not found for this company" });
      }

      product.category = category;
    }


    if (sku !== undefined) {
      const normalizedSku = sku?.trim().toUpperCase();

      if (!normalizedSku) {
        return res.status(400).json({ message: "SKU cannot be empty" });
      }
      product.sku = normalizedSku;
    }

    if (name !== undefined) {
      const trimmed = name?.trim();

      if (!trimmed) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }

      product.name = trimmed;
    }

    if (price !== undefined) {
      if (typeof price !== "number") {
        return res.status(400).json({ message: "Price must be a number" });
      }

      product.price = price;
    }

    if (stock !== undefined) {
      if (typeof stock !== "number") { 
        return res.status(400).json({ message: "Stock must be a number" });
      }

      product.stock = stock;
    }

    // Save
    await product.save();

    // Populate category
    await product.populate("category", "name");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: buildProductPayload(product),
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/** 
 * @description update product 
 * @route DELETE /api/products/:id
 * @access Protected 
 */
export const deleteProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

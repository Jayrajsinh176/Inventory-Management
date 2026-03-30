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

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
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
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
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
        message: "Name, SKU, category, and price are required",
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const productCount = await Product.countDocuments({ company: req.user.company });
    if (!canAddProductToPlan(company.plan, productCount)) {
      const plan = getSubscriptionPlan(company.plan);
      return res.status(403).json({
        message: `${plan.label} plan allows up to ${formatPlanProductLimit(company.plan)} products. Upgrade your plan to add more products.`,
      });
    }

    const existingCategory = await getScopedCategory(category, req.user.company);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found for this company" });
    }

    const existingSku = await Product.findOne({
      company: req.user.company,
      sku,
    }).select("_id");

    if (existingSku) {
      return res.status(400).json({ message: "SKU already exists for this company" });
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = ["name", "sku", "category", "price", "stock"];
    const updateFields = Object.keys(req.body).filter((field) => allowedFields.includes(field));

    if (!updateFields.length) {
      return res.status(400).json({
        message: "At least one valid field is required to update the product",
      });
    }

    if (req.body.category !== undefined) {
      if (!isValidObjectId(req.body.category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }

      const existingCategory = await getScopedCategory(req.body.category, req.user.company);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found for this company" });
      }
    }

    if (req.body.sku !== undefined) {
      const normalizedSku = req.body.sku?.trim().toUpperCase();
      if (!normalizedSku) {
        return res.status(400).json({ message: "SKU cannot be empty" });
      }

      const duplicateSku = await Product.findOne({
        company: req.user.company,
        sku: normalizedSku,
        _id: { $ne: product._id },
      }).select("_id");

      if (duplicateSku) {
        return res.status(400).json({ message: "SKU already exists for this company" });
      }

      product.sku = normalizedSku;
    }

    if (req.body.name !== undefined) {
      product.name = req.body.name?.trim();
    }

    if (req.body.category !== undefined) {
      product.category = req.body.category;
    }

    if (req.body.price !== undefined) {
      product.price = req.body.price;
    }

    if (req.body.stock !== undefined) {
      product.stock = req.body.stock;
    }

    await product.save();
    await product.populate("category", "name");

    return res.status(200).json({
      message: "Product updated successfully",
      product: buildProductPayload(product),
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

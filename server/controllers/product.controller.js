import mongoose, { get } from "mongoose";
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
    const query = { 
      company: new mongoose.Types.ObjectId(req.user.company) 
    };

    if (req.query.category) {
      if (!isValidObjectId(req.query.category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }

      query.category = new mongoose.Types.ObjectId(req.query.category);
    }

    if (req.query.search?.trim()) {
      const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), "i");
      query.$or = [{ name: searchRegex }, { sku: searchRegex }];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: total,
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


function getInventoryValue(products) {
  return products.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    return total + (price * stock);
  }, 0);
}

function getLowStockProducts(products){
  return products.filter((product)=>{
    const stock = Number(product.stock) || 0;
    return stock < (product.lowStockThreshold || 10);
  })
}

function getTotalProducts(products){
  return products.reduce((total, product) => {
    const stock = Number(product.stock) || 0;
    return total + (stock);
  }, 0);
}

function getAveragePrice(products){
  let productPrice = products.reduce((total, product) => {
    const price = Number(product.price) || 0;
    return total + (price);
  }, 0)
  let productStock = products.reduce((total, product) => {
    const stock = Number(product.stock) || 0;
    return total + (stock);
  }, 0)
  return productPrice / productStock;
}

function getOutOfStockCount(products){
  return products.reduce((total, product) => {
    const stock = Number(product.stock) || 0;
    return total + (stock === 0 ? 1 : 0);
  }, 0);
}

/** 
 * @description get product statistics
 * @route /api/products/stats
 * @access Protected
 */

export const getProductStats = async (req, res) => {
  try {
    let query = { company : new mongoose.Types.ObjectId(req.user.company)}
    console.log(query);
    let products = await Product.find(query).lean();
    console.log(products);


    return res.status(200).json({
      success : true,
      stats : {
        "inventoryValue" : getInventoryValue(products),
        "lowStocksAlerts" : getLowStockProducts(products).length,
        "lowStockProduct" : getLowStockProducts(products),
        "totalProducts" : getTotalProducts(products),
        "averagePrice" : getAveragePrice(products).toFixed(2),
        "outOfStockCount" : getOutOfStockCount(products),
      
      }
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message : "Internal server error this is from stats route",
    });
  
  }
};

/** 
 * @description get low stock products
 * @route /api/products/low-stock
 * @access Protected
 */

export const getLowStock = async (req, res) => {
  try {
    let query = { company : new mongoose.Types.ObjectId(req.user.company)};
    let products = await Product.find(query).lean();
    return res.status(200).json({
      success : true,
      "low-stock-products" : getLowStockProducts(products),
      "count" : getLowStockProducts(products).length,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message : "Internal server error"
    });
  }

}

function getCategoryName(categoryId,companyId) {
  if (!isValidObjectId(categoryId)) {
    return null;
  }

  return Category.findOne({
    _id: categoryId,
    company: companyId,
  }).select("name").lean();

}

/**
 * @description get product by category
 * @route /api/products/by-category/:categoryId
 * @access Protected
 */


export const getProductsByCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.categoryId)) {
      return res.status(400).json({
        sucess: false,
        message : "Invalid Category Id"
      });
    }
    let query = {
      company : new mongoose.Types.ObjectId(req.user.company),
      category : new mongoose.Types.ObjectId(req.params.categoryId)
    }
    let products = await Product.find(query).lean();
    return res.status(200).json({
      success : true,
      products : products,
      count : products.length,
      categoryName : await getCategoryName(query.category,query.company),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : false,
      message : "Internal server error"
    });
  }
}



import mongoose, { get } from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Company from "../models/company.model.js";
import Order from "../models/order.model.js";
import SupplyRequest from "../models/supplyRequest.model.js";
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";
import { logActivity } from "../utils/logActivity.js";
import {
  canAddProductToPlan,
  formatPlanProductLimit,
  getSubscriptionPlan,
} from "../utils/subscription.js";
import fs from "fs";
import csv from "csv-parser";


const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// JSON requests carry numbers as numbers; multipart form fields are strings.
// Accept both forms while rejecting blank, invalid, and non-finite values.
const parseOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    const error = new Error(`${fieldName} must be a number`);
    error.status = 400;
    throw error;
  }
  return parsed;
};

const escapeRegex = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const buildCategoryPayload = (category) => {
  if (!category) {
    return null;
  }

  if (typeof category === "object") {
    return {
      id: category._id || category.id,
      name: category.name,
    };
  }

  return category;
};

const buildProductPayload = (product) => ({
  id: product._id,
  company: product.company,
  name: product.name,
  sku: product.sku,
  image: product.image,
  barcode: product.barcode,
  category: buildCategoryPayload(product.category),
  vendor: product.vendor || null,
  price: product.price,
  mrp: product.mrp,
  dp: product.dp,
  bv: product.bv,
  stock: product.stock,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const handleProductError = (res, error) => {
  if (error.status === 400) {
    return res.status(400).json({ message: error.message });
  }
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
  company: new mongoose.Types.ObjectId(req.user.company),
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

    const parsedPage = Number.parseInt(req.query.page, 10);
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.max(parsedLimit, 1);

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("vendor", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Business Manager -> Show Location Stock
// Franchise -> Show only its own stock
if (req.user.role === "franchise") {

  const locationStocks = await LocationStock.find({
    company: req.user.company,
    locationId: req.user.franchise,
  }).lean();

  const stockMap = {};

  locationStocks.forEach((item) => {
    stockMap[item.product.toString()] = item.stock;
  });

  products.forEach((product) => {
    product.stock = stockMap[product._id.toString()] || 0;
  });
}



    const total = await Product.countDocuments(query);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
        success: false,
        message: "Invalid product id",
      });
    }

 const query = {
  _id: req.params.id,
  company: req.user.company,
};

if (req.user.role === "franchise") {
  query.$or = [
    {
      createdBy: "company",
    },
    {
      createdBy: "franchise",
      franchise: req.user.franchise,
    },
  ];
}

    const product = await Product.findOne(query)
      .populate("category", "name")
      .populate("vendor", "name")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
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
    let {
      name,
      sku,
      barcode,
      category,
      price,
      mrp,
      dp,
      bv,
      stock,
      vendor,
      lowStockThreshold,
    } = req.body;

    name = name?.trim();
    sku = sku?.trim().toUpperCase();

    if (
      !name ||
      !sku ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, SKU, Category and Price are required",
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id"
      });
    }

    if (vendor && !isValidObjectId(vendor)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor id"
      });
    }

    price = parseOptionalNumber(price, "Price");
    stock = parseOptionalNumber(stock, "Stock");

    lowStockThreshold = parseOptionalNumber(
      lowStockThreshold,
      "Low Stock Threshold"
    );
    if (price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number"
      });
    }

    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    const productCount = await Product.countDocuments({ company: req.user.company });
    if (!canAddProductToPlan(company.plan, productCount)) {
      const plan = getSubscriptionPlan(company.plan);
      return res.status(403).json({
        success: false,
        message: `${plan.label} plan allows up to ${formatPlanProductLimit(company.plan)} products. Upgrade your plan to add more products.`,
      });
    }

    const existingCategory = await getScopedCategory(category, req.user.company);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found for this company"
      });
    }

    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : "";
const isFranchise = req.user.role === "franchise";

const product = await Product.create({
  company: req.user.company,

franchise: isFranchise ? req.user.franchise : null,

  createdBy: isFranchise ? "franchise" : "company",

  name,
  sku,
  barcode: barcode?.trim() || `${req.user.company}-${sku}`,
  category,
  price,
  mrp: mrp ?? price,
  dp: dp ?? price,
  bv: bv ?? 0,
  stock: stock ?? 0,
  vendor: vendor || null,
  image,
  lowStockThreshold: lowStockThreshold ?? 5,
});

    // Create initial stock for Main Store
    const mainStore = await Franchise.findOne({
      company: req.user.company,
      isDefault: true,
    });

    if (mainStore) {
      await LocationStock.create({
        company: req.user.company,
        locationId: mainStore._id,
        product: product._id,
        stock: stock ?? 0,
      });
    }

    await product.populate("category", "name");

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "created_product",
      details: `Created product: ${name}`,
      metadata: {
        productId: product._id,
        sku: product.sku,
        category: product.category._id,
        price: product.price,
        stock: product.stock,
      },
    });

    return res.status(201).json({
      success: true,
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

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

const query = {
  _id: id,
  company: req.user.company,
};

const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = [
      "name",
      "sku",
      "category",
      "price",
      "stock",
      "vendor",
      "lowStockThreshold",
    ];
    const updateFields = Object.keys(req.body).filter((field) =>
      allowedFields.includes(field)
    );

    if (!updateFields.length) {
      return res.status(400).json({
        message: "At least one valid field is required to update the product",
      });
    }

    const { name, sku, category, vendor } = req.body;
    const price = parseOptionalNumber(req.body.price, "Price");
    const stock = parseOptionalNumber(req.body.stock, "Stock");
    const lowStockThreshold = parseOptionalNumber(
      req.body.lowStockThreshold,
      "Low Stock Threshold"
    );
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

    if (req.body.price !== undefined) {
      if (price === undefined) {
        return res.status(400).json({ message: "Price must be a number" });
      }

      product.price = price;
    }

    if (req.body.stock !== undefined) {
      if (stock === undefined) {
        return res.status(400).json({ message: "Stock must be a number" });
      }

      product.stock = stock;
    }

    if (req.body.lowStockThreshold !== undefined) {
      if (lowStockThreshold === undefined) {
        return res.status(400).json({
          message: "Low Stock Threshold must be a number",
        });
      }

      product.lowStockThreshold = lowStockThreshold;
    }

    if (vendor !== undefined) {
      if (vendor && !isValidObjectId(vendor)) {
        return res.status(400).json({ message: "Invalid vendor id" });
      }
      product.vendor = vendor || null;
    }

    if (req.file) {
      product.image =
        `/uploads/products/${req.file.filename}`;
    }

    await product.save();


    await product.populate("category", "name");

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "updated_product",
      details: `Updated product: ${product.name}`,
      metadata: {
        productId: product._id,
        sku: product.sku,
        updatedFields: Object.keys(req.body).filter(field => ["name", "sku", "category", "price", "stock"].includes(field)),
      },
    });

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

    if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only the Company Admin can delete products.",
  });
}

const query = {
  _id: req.params.id,
  company: req.user.company,
};

const product = await Product.findOneAndDelete(query);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "deleted_product",
      details: `Deleted product: ${product.name}`,
      metadata: {
        productId: product._id,
        sku: product.sku,
        name: product.name,
        price: product.price,
      },
    });

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

function getLowStockProducts(products) {
  return products.filter((product) => {
    const stock = Number(product.stock) || 0;
    return stock <= (product.lowStockThreshold || 10);
  })
}

function getTotalProducts(products) {
  return products.length;
}

function getAveragePrice(products) {
  let productPrice = products.reduce((total, product) => {
    const price = Number(product.price) || 0;
    return total + (price);
  }, 0)
  let productStock = products.reduce((total, product) => {
    const stock = Number(product.stock) || 0;
    return total + (stock);
  }, 0)
  // Prevent division by zero
  return productStock > 0 ? productPrice / productStock : 0;
}

function getOutOfStockCount(products) {
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
  let products;

if (req.user.role === "franchise") {

  const stocks = await LocationStock.find({
    company: req.user.company,
    locationId: req.user.locationId,
  }).populate("product");

  products = stocks.map((item) => ({
    ...item.product.toObject(),
    stock: item.stock,
  }));

} else {

  products = await Product.find({
    company: req.user.company,
  }).lean();

}
    // console.log(products);


    return res.status(200).json({
      success: true,
      stats: {
        "inventoryValue": getInventoryValue(products),
        "lowStocksAlerts": getLowStockProducts(products).length,
        "lowStockProduct": getLowStockProducts(products),
        "totalProducts": getTotalProducts(products),
        "averagePrice": getAveragePrice(products).toFixed(2),
        "outOfStockCount": getOutOfStockCount(products),

      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error this is from stats route",
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
    let query = { company: new mongoose.Types.ObjectId(req.user.company) };
  
   let products;

if (req.user.role === "franchise") {

  const stocks = await LocationStock.find({
    company: req.user.company,
    locationId: req.user.locationId,
  }).populate("product");

  products = stocks.map((item) => ({
    ...item.product.toObject(),
    stock: item.stock,
  }));

} else {

  products = await Product.find(query).lean();

}
    return res.status(200).json({
      success: true,
      "low-stock-products": getLowStockProducts(products),
      "count": getLowStockProducts(products).length,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }

}

function getCategoryName(categoryId, companyId) {
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
        message: "Invalid Category Id"
      });
    }
    let query = {
      company: new mongoose.Types.ObjectId(req.user.company),
      category: new mongoose.Types.ObjectId(req.params.categoryId)
    }
   
    let products = await Product.find(query).lean();
    return res.status(200).json({
      success: true,
      products: products,
      count: products.length,
      categoryName: await getCategoryName(query.category, query.company),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


/**
 * @description get products by vendor
 * @route GET /api/products/vendor/:vendorName
 * @access Protected
 */
export const getProductsByVendor = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.company);
    const vendorName = req.params.vendorName;

    const products = await Product.find({
      company: companyId,
      vendor: { $regex: vendorName, $options: "i" }
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Products by vendor fetched successfully",
      data: products
    });
  } catch (error) {
    console.error('Get Products by Vendor Error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV file.",
      });
    }

    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          const company = await Company.findById(req.user.company);

          const plan = getSubscriptionPlan(company.plan);

          const existingProducts = await Product.countDocuments({
            company: req.user.company,
          });

          const remainingSlots = Number.isFinite(plan.maxProducts)
            ? plan.maxProducts - existingProducts
            : Infinity;

          if (
            Number.isFinite(plan.maxProducts) &&
            rows.length > remainingSlots
          ) {
            fs.unlinkSync(req.file.path);

            return res.status(403).json({
              success: false,
              message: `Your ${company.plan} plan has only ${remainingSlots} product slots remaining, but your CSV contains ${rows.length} products.`,
            });
          }

          const importedProducts = [];
          const errors = [];

          for (const row of rows) {
            try {

              const category = await Category.findOne({
                company: req.user.company,
                name: new RegExp(`^${row.category}$`, "i"),
              });

              if (!category) {
                errors.push(
                  `Category '${row.category}' not found for '${row.name}'`
                );
                continue;
              }

              const existingSku = await Product.findOne({
                company: req.user.company,
                sku: row.sku,
              });

              if (existingSku) {
                errors.push(`SKU '${row.sku}' already exists`);
                continue;
              }

             const isFranchise = req.user.role === "franchise";
const mainStore = await Franchise.findOne({
  company: req.user.company,
  isDefault: true,
});

if (mainStore) {
  await LocationStock.create({
    company: req.user.company,
    locationId: mainStore._id,
    product: product._id,
    stock: Number(row.stock),
  });
}
const product = await Product.create({
  
  company: req.user.company,
  franchise: isFranchise ? req.user.franchise : null,
  createdBy: isFranchise ? "franchise" : "company",
                name: row.name,
                sku: row.sku.toUpperCase(),
                barcode: `${req.user.company}-${row.sku.toUpperCase()}`,
                category: category._id,
                price: Number(row.price),
                mrp: Number(row.mrp),
                dp: Number(row.dp),
                bv: Number(row.bv),
                stock: Number(row.stock),
                lowStockThreshold: Number(row.lowStockThreshold),
              });

              importedProducts.push(product);

            } catch (err) {
              errors.push(err.message);
            }
          }

          fs.unlinkSync(req.file.path);

          return res.status(200).json({
            success: true,
            message: "Products imported successfully",
            imported: importedProducts.length,
            skipped: errors.length,
            errors,
          });



        } catch (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const companyId = new mongoose.Types.ObjectId(req.user.company);
    const productId = new mongoose.Types.ObjectId(req.params.id);
    const {
      search = "",
      date,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);
    const skip = (currentPage - 1) * pageLimit;

const productQuery = {
  _id: productId,
  company: companyId,
};

if (req.user.role === "franchise") {
  productQuery.$or = [
    {
      createdBy: "company",
    },
    {
      createdBy: "franchise",
      franchise: req.user.franchise,
    },
  ];
}



const product = await Product.findOne(productQuery)
  .populate("category", "name")
  .populate("vendor", "name phone email address company status")
  .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

const completedProductSaleMatch = {
    company: companyId,
    status: "completed",
    "items.product": productId,
};

if (req.user.role === "franchise") {
    completedProductSaleMatch.franchise =
        new mongoose.Types.ObjectId(req.user.franchise);
}

    const [summaryResult, allSales, allPurchases] = await Promise.all([
      Order.aggregate([
        { $match: completedProductSaleMatch },
        { $unwind: "$items" },
        { $match: { "items.product": productId } },
        {
          $group: {
            _id: null,
            totalUnitsSold: { $sum: { $ifNull: ["$items.quantity", 0] } },
            totalRevenueGenerated: { $sum: { $ifNull: ["$items.subtotal", 0] } },
          },
        },
      ]),
      Order.aggregate([
        { $match: completedProductSaleMatch },
        {
          $addFields: {
            billingDate: { $ifNull: ["$paidAt", "$createdAt"] },
          },
        },
        { $unwind: "$items" },
        { $match: { "items.product": productId } },
        { $sort: { billingDate: 1, createdAt: 1 } },
        {
          $project: {
            _id: 0,
            date: "$billingDate",
            quantity: "$items.quantity",
          },
        },
      ]),
      SupplyRequest.aggregate([
        {
          $match: {
            companyId,
            productId,
            $or: [
              { status: "delivered" },
              { paymentStatus: "paid" },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $ifNull: [
                "$actualDeliveryDate",
                { $ifNull: ["$paidAt", "$updatedAt"] },
              ],
            },
            quantity: "$quantity",
          },
        },
        { $sort: { date: 1 } },
      ]),
    ]);

    const totalUnitsSold = summaryResult[0]?.totalUnitsSold || 0;
    const totalRevenueGenerated = summaryResult[0]?.totalRevenueGenerated || 0;
    const totalPurchased = allPurchases.reduce(
      (sum, purchase) => sum + (Number(purchase.quantity) || 0),
      0,
    );
    const inferredOpeningStock = Math.max(
      0,
      (Number(product.stock) || 0) + totalUnitsSold - totalPurchased,
    );
    let remainingStock = inferredOpeningStock;
    const stockMovement = [
      {
        date: product.createdAt,
        action: "Stock Added",
        quantity: inferredOpeningStock,
        remainingStock,
      },
      ...[
        ...allPurchases.map((purchase) => ({
          date: purchase.date,
          action: "Purchase",
          quantity: Number(purchase.quantity) || 0,
        })),
        ...allSales.map((sale) => ({
          date: sale.date,
          action: "Sold",
          quantity: -(Number(sale.quantity) || 0),
        })),
      ]
        .sort((left, right) => new Date(left.date) - new Date(right.date))
        .map((movement) => {
          remainingStock += movement.quantity;
          return {
            ...movement,
            remainingStock,
          };
        }),
    ];

    const salesMatchStage = { ...completedProductSaleMatch };
    if (date) {
      const startDate = new Date(date);
      if (!Number.isNaN(startDate.getTime())) {
        const endDate = new Date(startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        salesMatchStage.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    const salesPipeline = [
      { $match: salesMatchStage },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "order",
          as: "invoice",
        },
      },
      {
        $addFields: {
          invoice: { $first: "$invoice" },
          invoiceNumber: {
            $ifNull: [{ $first: "$invoice.invoiceNumber" }, "$orderNumber"],
          },
          billingDate: { $ifNull: ["$paidAt", "$createdAt"] },
          customerDisplayName: {
            $cond: [
              { $eq: [{ $trim: { input: { $ifNull: ["$customerName", ""] } } }, ""] },
              "Walk-in Customer",
              "$customerName",
            ],
          },
          fullItems: "$items",
        },
      },
      { $unwind: "$items" },
      { $match: { "items.product": productId } },
    ];

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      salesPipeline.push({
        $match: {
          $or: [
            { invoiceNumber: { $regex: trimmedSearch, $options: "i" } },
            { orderNumber: { $regex: trimmedSearch, $options: "i" } },
            { customerDisplayName: { $regex: trimmedSearch, $options: "i" } },
          ],
        },
      });
    }

    salesPipeline.push(
      { $sort: { billingDate: sort === "oldest" ? 1 : -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: pageLimit },
            {
              $project: {
                orderId: "$_id",
                orderNumber: 1,
                invoiceId: "$invoice._id",
                invoiceNumber: 1,
                customerName: "$customerDisplayName",
                quantitySold: "$items.quantity",
                unitPrice: "$items.unitPrice",
                totalAmount: "$items.subtotal",
                orderTotal: "$total",
                subtotal: 1,
                tax: 1,
                discount: 1,
                paymentMethod: 1,
                paymentStatus: 1,
                billingDate: 1,
                items: "$fullItems",
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    );

    const [salesResult] = await Order.aggregate(salesPipeline);
    const totalRecords = salesResult?.totalCount?.[0]?.count || 0;
    const price = Number(product.price) || 0;
    const costPrice = Number(product.costPrice) || 0;
    const stock = Number(product.stock) || 0;

    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      data: {
        product: {
          id: product._id,
          name: product.name,
          sku: product.sku,
          image: product.image,
          category: buildCategoryPayload(product.category),
          vendor: product.vendor || null,
          price,
          costPrice,
          stock,
          inventoryValue: Math.round(price * stock * 100) / 100,
          status: stock > (product.lowStockThreshold || 5)
            ? "In Stock"
            : stock > 0
              ? "Low Stock"
              : "Out of Stock",
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
        overview: {
          totalUnitsSold,
          totalRevenueGenerated: Math.round(totalRevenueGenerated * 100) / 100,
          profitPerUnit: Math.round((price - costPrice) * 100) / 100,
        },
        salesHistory: salesResult?.data || [],
        stockMovement,
        pagination: {
          total: totalRecords,
          page: currentPage,
          pages: Math.ceil(totalRecords / pageLimit),
          limit: pageLimit,
        },
      },
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

export const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid quantity.",
      });
    }

    const query = {
  _id: id,
  company: req.user.company,
};


const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const qty = Number(quantity);

    // Update product stock
    product.stock += qty;

    await product.save();

    // Business plan → Update Main Store inventory
    const company = req.user.company;

    const mainStore = await Franchise.findOne({
      company,
      isDefault: true,
    });

    if (mainStore) {
      const locationStock = await LocationStock.findOne({
        company,
        locationId: mainStore._id,
        product: product._id,
      });

      if (locationStock) {
        locationStock.stock += qty;
        await locationStock.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Stock added successfully.",
      product,
    });

  } catch (error) {
    console.error("Add Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
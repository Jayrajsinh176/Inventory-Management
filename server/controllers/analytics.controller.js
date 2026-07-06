  import mongoose from "mongoose";
  import Product from "../models/product.model.js";
  import Order from "../models/order.model.js";
  import Company from "../models/company.model.js";
  import Franchise from "../models/franchise.model.js";
import User from "../models/users.model.js";
import { isAnalyticsAllowed } from "../utils/subscription.js";


  export const getStockMovementAnalysis = async (req, res) => {
    try {
      const companyId = new mongoose.Types.ObjectId(
        req.user.company
      );

      const company = await Company.findById(req.user.company).select("plan");

if (!company) {
  return res.status(404).json({
    success: false,
    message: "Company not found",
  });
}

if (!isAnalyticsAllowed(company.plan)) {
  return res.status(403).json({
    success: false,
    message:
      "Analytics is available only on Standard and Business plans. Please upgrade your subscription.",
  });
}

      const orders = await Order.find({
        company: companyId,
        paymentStatus: "paid",
      }).lean();

      const months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec",
      ];

      const monthlySales = {};

      months.forEach((month) => {
        monthlySales[month] = 0;
      });

      orders.forEach((order) => {
        const month =
          months[new Date(order.createdAt).getMonth()];

        const quantity = order.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        monthlySales[month] += quantity;
      });

      const currentMonth = new Date().getMonth();

      const data = [];

      for (let i = 5; i >= 0; i--) {
        const index = (currentMonth - i + 12) % 12;

        data.push({
          month: months[index],
          actualUnits: monthlySales[months[index]],
        });
      }

      const products = await Product.find({
        company: companyId,
      }).lean();

      const totalInventoryValue = products.reduce(
        (sum, product) =>
          sum +
          (Number(product.price) || 0) *
          (Number(product.stock) || 0),
        0
      );

      res.json({
        success: true,
        data,
        totalProductsAnalyzed: products.length,
        totalInventoryValue,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const getCategoryPerformanceAnalysis = async (req, res) => {
    try {
    const company = await Company.findById(req.user.company).select("plan");

if (!company) {
  return res.status(404).json({
    success: false,
    message: "Company not found",
  });
}

if (!isAnalyticsAllowed(company.plan)) {
  return res.status(403).json({
    success: false,
    message:
      "Analytics is available only on Standard and Business plans. Please upgrade your subscription.",
  });
}

      const products = await Product.find({
        company: req.user.company,
      }).populate("category");

      const categoryMap = {};

      products.forEach((product) => {
        const categoryName =
          product.category?.name || "Uncategorized";

        const value =
          (Number(product.price) || 0) *
          (Number(product.stock) || 0);

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }

        categoryMap[categoryName] += value;
      });

      const data = Object.keys(categoryMap).map((category) => ({
        category,
        actualValue: categoryMap[category],
      }));

      const totalInventoryValue = data.reduce(
        (sum, item) => sum + item.actualValue,
        0
      );

      res.json({
        success: true,
        totalCategoriesAnalyzed: data.length,
        totalInventoryValue,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const getReorderPatternsAnalysis = async (req, res) => {
    try {
      const company = await Company.findById(req.user.company).select("plan");

if (!company) {
  return res.status(404).json({
    success: false,
    message: "Company not found",
  });
}

if (!isAnalyticsAllowed(company.plan)) {
  return res.status(403).json({
    success: false,
    message:
      "Analytics is available only on Standard and Business plans. Please upgrade your subscription.",
  });
}

      const products = await Product.find({
        company: req.user.company,
      });

      const lowStock = products.filter(
        (product) => Number(product.stock) <= 10
      );

      const data = [
        {
          month: "Low Stock",
          value: lowStock.length,
        },
      ];

      res.json({
        success: true,
        avgReorderFrequency: lowStock.length,
        currentLowStockItems: lowStock.length,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getBusinessOverview = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.plan !== "Business") {
      return res.status(403).json({
        success: false,
        message:
          "Business Dashboard is available only on the Business plan. Please upgrade your subscription.",
      });
    }

    const companyId = new mongoose.Types.ObjectId(req.user.company);

    const totalFranchises = await Franchise.countDocuments({
      company: companyId,
    });

    const orders = await Order.find({
      company: companyId,
      paymentStatus: "paid",
    }).lean();

    const totalOrders = orders.length;

    const totalStaff = await User.countDocuments({
  company: companyId,
});

    const totalProductsSold = orders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + item.quantity,
          0
        ),
      0
    );

    return res.json({
      success: true,
      stats: {
  totalFranchises,
  totalStaff,
  totalOrders,
  totalProductsSold,
}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
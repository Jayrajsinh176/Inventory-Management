import Product from "../models/product.model.js";
import LocationStock from "../models/locationStock.model.js";
import Company from "../models/company.model.js";
import { isMultiLocationStockAllowed } from "../utils/subscription.js";

export const assignStock = async (req, res) => {
  try {
    const { franchiseId, productId, quantity } = req.body;

    if (!franchiseId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const company = await Company.findById(req.user.company).select("plan");
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isMultiLocationStockAllowed(company.plan)) {
      return res.status(403).json({
        success: false,
        message:
  "Multi-location stock assignment is only available on the Standard and Business plans. Upgrade your plan to assign stock across multiple locations.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

let locationStock = await LocationStock.findOne({
  company: req.user.company,
  locationId: franchiseId,
  product: productId,
});

    if (locationStock) {
     locationStock.stock += Number(quantity);
await locationStock.save();
    } else {
     locationStock = await LocationStock.create({
  company: req.user.company,
  locationId: franchiseId,
  product: productId,
  stock: Number(quantity),
});
    }

    // Minus from main stock
    product.stock -= Number(quantity);
    await product.save();

    return res.json({
      success: true,
      message: "Stock assigned successfully",
  data: locationStock,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

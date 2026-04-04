import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      uppercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    lowStockThreshold: {
      type: Number,
      required: true,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    }
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1 });
productSchema.index({ company: 1, sku: 1 }, { unique: true });
const Product = mongoose.model("Product", productSchema);

export default Product;

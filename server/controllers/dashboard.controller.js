import mongoose from "mongoose";
import Product from "../models/product.model.js";

/** 
 * @description Get dashboard statistics for the user's company
 * @route GET /api/dashboard
 * @access Protected
 */
export const dashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const companyId = req.user.company;
        // total products
        const totalProducts = await Product.countDocuments({ company: companyId });
        // total categories
        const totalCategories = await mongoose.connection.collection('categories').countDocuments({ company: companyId });
        // total users
        const totalUsers = await mongoose.connection.collection('users').countDocuments({ company: companyId });
        
        // low stock alerts - count products where stock <= lowStockThreshold
        const lowStockProducts = await Product.find({ company: companyId });
        const totalAlerts = lowStockProducts.filter(product => product.stock <= product.lowStockThreshold).length;
        
        // inventory value - set to 0 for now
        const totalInventoryValue = 0;
        res.json({
            totalProducts,
            totalCategories,
            totalAlerts,
            totalUsers,
            totalInventoryValue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Get low stock alerts for products in the user's company
 * @route GET /api/dashboard/low-stock-alerts
 * @access Protected
 */
export const getLowStockAlerts = async (req, res) => {
    try {
        const companyId = req.user.company;
        const products = await Product.find({ company: companyId })
            .select('name sku stock lowStockThreshold price vendor category')
            .populate('category', 'name')
            .populate('vendor', 'name');
        
        // Filter and sort by how critical (lowest stock first)
        const lowStockProducts = products
            .filter(product => product.stock <= product.lowStockThreshold)
            .sort((a, b) => a.stock - b.stock);
        
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
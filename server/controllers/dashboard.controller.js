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
        // low stock alerts
        const totalAlerts = await mongoose.connection.collection('alerts').countDocuments({ company: companyId, type: 'low_stock' });
        // total users
        const totalUsers = await mongoose.connection.collection('users').countDocuments({ company: companyId });
        // inventory value
        const inventoryValue = await mongoose.connection.collection('products').aggregate([
            { $match: { company: mongoose.Types.ObjectId(companyId) } },
            { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$quantity"] } } } }
        ]).toArray();
        const totalInventoryValue = inventoryValue[0]?.totalValue || 0;
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
        const products = await Product.find({ company: companyId }).select('name sku stock lowStockThreshold');
        const lowStockProducts = products.filter(product => product.stock <= product.lowStockThreshold);
        console.log(lowStockProducts);
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
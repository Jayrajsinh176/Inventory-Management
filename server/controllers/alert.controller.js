import mongoose from 'mongoose';
import Product from '../models/product.model.js';

/**
 * @description Get low stock alerts for products with stock less than or equal to thresold
 * @route GET /api/alerts/low-stock
 * @access Protected
 */
export const getLowStockAlerts = async (req, res) => {
    try {
        const companyId = req.user.company;
        const products = await Product.find({ 
            company: companyId 
        }).select('name stock lowStockThreshold');
        const lowStockProducts = products.filter(product => product.stock <= product.lowStockThreshold);
        res.status(200).json({
            success: true,
            data: lowStockProducts
        });
    } catch (error) {
        console.error('Error fetching low stock alerts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};  
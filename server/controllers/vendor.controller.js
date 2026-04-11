import Vendor from '../models/vendor.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import Alert from '../models/alert.model.js';

/**
 * @description Create a new vendor
 * @route POST /api/vendor
 * @access Private
 */
export const createVendor = async (req,res) => {
    try {
        const { name, email, phone, address } = req.body;
        const companyId = req.user.companyId;

        if (!name || !phone) {
            return res.status(400).json({ 
                success : false,
                message: 'Name, phone and address are required' 
            });
        }
        const existingVendor = await Vendor.findOne({ email, phone, companyId });
        if (existingVendor) {
            return res.status(400).json({ 
                success : false,
                message: 'Vendor with this email or phone number already exists' 
            });
        }
        const newVendor = new Vendor({
            companyId,
            name,
            email,
            phone,
            address,
        });

        await newVendor.save();
        res.status(201).json({ 
            success : true,
            message: 'Vendor created successfully',
            data : newVendor
        });
    } catch (error) {
        console.log("Create Vendor Error : ", error);
        res.status(500).json({ 
            success : false,
            message: 'Failed to create vendor' 
        });
    }
};

/**
 * @description Get all vendors
 * @route GET /api/vendor
 * @access Private
 */

export const getVendors = async (req,res) => {
    try {
        const companyId = req.user.companyId;
        const vendors = await Vendor.find({ companyId });
        res.status(200).json({ 
            success : true,
            message: 'Vendors fetched successfully',
            data : vendors
        });
    } catch (error) {
        console.log("Get Vendors Error : ", error);
        res.status(500).json({ 
            success : false,
            message: 'Failed to fetch vendors' 
        });
    }
};

/** 
 * @description Get vendor by ID
 * @route GET /api/vendor/:id
 * @access Private  
 */
export const getVendorById = async (req,res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const vendor = await Vendor.findOne({ _id : id, companyId });
        if(!vendor){
            return res.status(404).json({
                success : false,
                message : 'Vendor not found'
            });
        }
        res.status(200).json({
            success : true,
            message : 'Vendor getched succeddfully.',
            data : vendor
        });
    } catch (error) {
        console.log("Get Vendor By ID Error : ", error);
        res.status(500).json({
            success : false,
            message: 'Failed to fetch vendor details'
        });
    }
};

/** 
 * @description Update vendor details
 * @route PUT /api/vendor/:id
 * @access Private
 */
export const updateVendor = async (req,res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const { name, email, phone, address } = req.body;
        const vendor = await Vendor.findOne({ _id : id, companyId });
        if(!vendor){
            return res.status(404).json({
                success : false,
                message : 'Vendor not found'
            });
        }
        vendor.name = name || vendor.name;
        vendor.email = email || vendor.email;
        vendor.phone = phone || vendor.phone;
        vendor.address = address || vendor.address;
        await vendor.save();
        res.status(200).json({
            success : true,
            message : 'Vendor updated successfully',
            data : vendor
        });
    } catch (error) {
        console.log("Update Vendor Error : ", error);
        res.status(500).json({
            success : false,
            message: 'Failed to update vendor details'
        });
    }
};


/** 
 * @description Delete a vendor
 * @route DELETE /api/vendor/:id
 * @access Private
 */

export const deleteVendor = async(req,res) =>{
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const vendor = await Vendor.findOne({ _id : id, companyId });
        if(!vendor){
            return res.status(404).json({
                success : false,
                message : 'Vendor not found'
            });
        }

        await vendor.remove();
        res.status(200).json({
            success : true,
            message : 'Vendor deleted successfully'
        });

    } catch(error){
        console.log("Delete Vendor Error : ", error);
        res.status(500).json({
            success : false,
            message : 'Failed to delete vendor',
        })
    }
}

/**
 * @description get products supplied by a vendor
 * @route GET /api/vendor/:id/products
 * @access Private
 */

export const getVendorProducts = async( req,res ) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const products = await Product.find({ vendorId : id , companyId});
        res.status(200).json({
            success : true,
            message : 'vendor products fetched successfully.',
            data : products,
            count : products.length,
        })
    } catch (error ){
        console.log("Get Vendor Products Error : ", error);
        res.status(500).json({
            success : false,
            message : 'Failed to fetch vendor products'
        });
    }
}

/** 
 * @description get orders associated with a vendor
 * @route GET /api/vendor/:id/orders
 * @access Private
 */

export const getVendorOrders = async( req,res ) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const orders = await Order.find({ vendorId : id , companyId});
        res.status(200).json({
            success : true,
            message : 'vendor orders fetched successfully.',
            data : orders,
            count : orders.length,
        })
    } catch (error ){
        console.log("Get Vendor Orders Error : ", error);
        res.status(500).json({
            success : false,
            message : 'Failed to fetch vendor orders'
        });
    }
}

/** 
 * @description get invoices associated with a vendor
 * @route GET /api/vendor/:id/invoices
 * @access Private
 */

export const getVendorInvoices = async( req,res ) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const invoices = await Invoice.find({ vendorId : id , companyId});
        res.status(200).json({
            success : true,
            message : 'vendor invoices fetched successfully.',
            data : invoices,
            count : invoices.length,
        })
    } catch (error ){
        console.log("Get Vendor Invoices Error : ", error);
        res.status(500).json({
            success : false,
            message : 'Failed to fetch vendor invoices'
        });
    }
}

/**
 * @description get alerts associated with a vendor
 * @route GET /api/vendor/:id/alerts
 * @access Private
 */
export const getVendorAlerts = async( req,res ) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const alerts = await Alert.find({ vendorId : id , companyId});
        res.status(200).json({
            success : true,
            message : 'vendor alerts fetched successfully.',
            data : alerts,
            count : alerts.length,
        })
    } catch (error ){
        console.log("Get Vendor Alerts Error : ", error);
        res.status(500).json({
            success : false,
            message : 'Failed to fetch vendor alerts'
        });
    }
}

/** 
 * @description get performance stats for a vendor
 * @route GET /api/vendor/:id/stats
 * @access Private
 */
export const getVendorStats = async( req,res ) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const totalProducts = await Product.countDocuments({ vendorId : id , companyId});
        const totalOrders = await Order.countDocuments({ vendorId : id , companyId});
        const totalInvoices = await Invoice.countDocuments({ vendorId : id , companyId});
        const totalAlerts = await Alert.countDocuments({ vendorId : id , companyId});
        res.status(200).json({
            success : true,
            message : 'vendor stats fetched successfully.',
            data : {
                totalProducts,
                totalOrders,
                totalInvoices,
                totalAlerts,
            },
        })
    } catch (error ){
        console.log("Get Vendor Stats Error : ", error);
        res.status(500).json({
            success : false,
            message : 'Failed to fetch vendor stats'
        });
    }
}
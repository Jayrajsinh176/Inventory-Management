import mongoose from 'mongoose';
import Vendor from '../models/vendor.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import Alert from '../models/alert.model.js';
import SupplyRequest from '../models/supplyRequest.model.js';

/**
 * @description Create a new vendor
 * @route POST /api/vendor
 * @access Private
 */
export const createVendor = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name and phone are required'
            });
        }

        const existingVendor = await Vendor.findOne({ email, phone, companyId });
        if (existingVendor) {
            return res.status(400).json({
                success: false,
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
            success: true,
            message: 'Vendor created successfully',
            data: newVendor
        });
    } catch (error) {
        console.log("Create Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to create vendor'
        });
    }
};

/**
 * @description Get all vendors
 * @route GET /api/vendor
 * @access Private
 */
export const getVendors = async (req, res) => {
    try {
        const companyId = new mongoose.Types.ObjectId(req.user.company);
        const vendors = await Vendor.find({ companyId }).populate('products');
        res.status(200).json({
            success: true,
            message: 'Vendors fetched successfully',
            data: vendors,
            count: vendors.length
        });
    } catch (error) {
        console.log("Get Vendors Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendors'
        });
    }
};

/**
 * @description Get vendor by ID
 * @route GET /api/vendor/:id
 * @access Private
 */
export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId }).populate('products');
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vendor fetched successfully.',
            data: vendor
        });
    } catch (error) {
        console.log("Get Vendor By ID Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor details'
        });
    }
};

/**
 * @description Update vendor details
 * @route PUT /api/vendor/:id
 * @access Private
 */
export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);
        const { name, email, phone, address, status } = req.body;

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        vendor.name = name || vendor.name;
        vendor.email = email || vendor.email;
        vendor.phone = phone || vendor.phone;
        vendor.address = address || vendor.address;
        if (status) vendor.status = status;
        vendor.updatedAt = new Date();

        await vendor.save();
        res.status(200).json({
            success: true,
            message: 'Vendor updated successfully',
            data: vendor
        });
    } catch (error) {
        console.log("Update Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor details'
        });
    }
};

/**
 * @description Delete a vendor
 * @route DELETE /api/vendor/:id
 * @access Private
 */
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Delete all supply requests associated with this vendor
        await SupplyRequest.deleteMany({ vendorId: id, companyId });

        // Remove vendor reference from products
        await Product.updateMany(
            { vendor: vendor.name, company: companyId },
            { vendor: 'Unknown Vendor' }
        );

        // Delete the vendor
        await Vendor.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Vendor deleted successfully'
        });
    } catch (error) {
        console.log("Delete Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete vendor'
        });
    }
};

/**
 * @description Get products supplied by a vendor
 * @route GET /api/vendor/:id/products
 * @access Private
 */
export const getVendorProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const products = await Product.find({
            vendor: vendor.name,
            company: companyId
        }).populate('category');

        res.status(200).json({
            success: true,
            message: 'Vendor products fetched successfully.',
            data: products,
            count: products.length
        });
    } catch (error) {
        console.log("Get Vendor Products Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor products'
        });
    }
};

/**
 * @description Assign a product to a vendor
 * @route POST /api/vendor/:id/products
 * @access Private
 */
export const assignProductToVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const product = await Product.findOne({ _id: productId, company: companyId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update product with vendor
        product.vendor = vendor.name;
        await product.save();

        // Add product to vendor's product list if not already there
        if (!vendor.products.includes(productId)) {
            vendor.products.push(productId);
            await vendor.save();
        }

        res.status(200).json({
            success: true,
            message: 'Product assigned to vendor successfully',
            data: product
        });
    } catch (error) {
        console.log("Assign Product to Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign product to vendor'
        });
    }
};

/**
 * @description Remove a product from a vendor
 * @route DELETE /api/vendor/:id/products/:productId
 * @access Private
 */
export const removeProductFromVendor = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const product = await Product.findOne({ _id: productId, company: companyId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update product to remove vendor
        product.vendor = 'Unknown Vendor';
        await product.save();

        // Remove product from vendor's product list
        vendor.products = vendor.products.filter(p => p.toString() !== productId);
        await vendor.save();

        res.status(200).json({
            success: true,
            message: 'Product removed from vendor successfully',
            data: product
        });
    } catch (error) {
        console.log("Remove Product from Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove product from vendor'
        });
    }
};

/**
 * @description Get orders associated with a vendor
 * @route GET /api/vendor/:id/orders
 * @access Private
 */
export const getVendorOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const orders = await Order.find({ company: companyId }).populate({
            path: 'items.product',
            match: { vendor: vendor.name }
        });

        // Filter orders that actually contain vendor's products
        const vendorOrders = orders.filter(order =>
            order.items.some(item => item.product && item.product.vendor === vendor.name)
        );

        res.status(200).json({
            success: true,
            message: 'Vendor orders fetched successfully.',
            data: vendorOrders,
            count: vendorOrders.length
        });
    } catch (error) {
        console.log("Get Vendor Orders Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor orders'
        });
    }
};

/**
 * @description Get invoices associated with a vendor
 * @route GET /api/vendor/:id/invoices
 * @access Private
 */
export const getVendorInvoices = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const invoices = await Invoice.find({ company: companyId }).populate({
            path: 'order',
            populate: {
                path: 'items.product'
            }
        });

        // Filter invoices that contain vendor's products
        const vendorInvoices = invoices.filter(invoice =>
            invoice.order && invoice.order.items.some(item => item.product && item.product.vendor === vendor.name)
        );

        res.status(200).json({
            success: true,
            message: 'Vendor invoices fetched successfully.',
            data: vendorInvoices,
            count: vendorInvoices.length
        });
    } catch (error) {
        console.log("Get Vendor Invoices Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor invoices'
        });
    }
};

/**
 * @description Get alerts associated with a vendor
 * @route GET /api/vendor/:id/alerts
 * @access Private
 */
export const getVendorAlerts = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const alerts = await Alert.find({ companyId }).populate('product');

        // Filter alerts for vendor's products
        const vendorAlerts = alerts.filter(alert =>
            alert.product && alert.product.vendor === vendor.name
        );

        res.status(200).json({
            success: true,
            message: 'Vendor alerts fetched successfully.',
            data: vendorAlerts,
            count: vendorAlerts.length
        });
    } catch (error) {
        console.log("Get Vendor Alerts Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor alerts'
        });
    }
};

/**
 * @description Create a supply request from a vendor
 * @route POST /api/vendor/:id/supply-requests
 * @access Private
 */
export const createSupplyRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, quantity, expectedDeliveryDate, quotedPrice, notes } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);
        const userId = req.user._id;

        if (!productId || !quantity || !expectedDeliveryDate || !quotedPrice) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, quantity, expected delivery date, and quoted price are required'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const product = await Product.findOne({ _id: productId, company: companyId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Generate unique request number
        const requestNumber = `SR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const supplyRequest = new SupplyRequest({
            companyId,
            vendorId: id,
            productId,
            requestNumber,
            quantity,
            expectedDeliveryDate: new Date(expectedDeliveryDate),
            quotedPrice,
            notes,
            createdBy: userId,
        });

        await supplyRequest.save();

        // Update vendor's total supply requests
        vendor.totalSupplyRequests = (vendor.totalSupplyRequests || 0) + 1;
        await vendor.save();

        res.status(201).json({
            success: true,
            message: 'Supply request created successfully',
            data: supplyRequest
        });
    } catch (error) {
        console.log("Create Supply Request Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to create supply request'
        });
    }
};

/**
 * @description Get all supply requests for a vendor
 * @route GET /api/vendor/:id/supply-requests
 * @access Private
 */
export const getSupplyRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const query = { vendorId: id, companyId };
        if (status) {
            query.status = status;
        }

        const supplyRequests = await SupplyRequest.find(query)
            .populate('productId')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Supply requests fetched successfully',
            data: supplyRequests,
            count: supplyRequests.length
        });
    } catch (error) {
        console.log("Get Supply Requests Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch supply requests'
        });
    }
};

/**
 * @description Update supply request status
 * @route PUT /api/vendor/:id/supply-requests/:requestId
 * @access Private
 */
export const updateSupplyRequestStatus = async (req, res) => {
    try {
        const { id, requestId } = req.params;
        const { status, actualDeliveryDate } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const supplyRequest = await SupplyRequest.findOne({ _id: requestId, vendorId: id, companyId });
        if (!supplyRequest) {
            return res.status(404).json({
                success: false,
                message: 'Supply request not found'
            });
        }

        supplyRequest.status = status;

        // If delivered, update the delivery date
        if (status === 'delivered' && actualDeliveryDate) {
            supplyRequest.actualDeliveryDate = new Date(actualDeliveryDate);
            supplyRequest.isOnTime = new Date(actualDeliveryDate) <= supplyRequest.expectedDeliveryDate;
        }

        await supplyRequest.save();

        res.status(200).json({
            success: true,
            message: 'Supply request status updated successfully',
            data: supplyRequest
        });
    } catch (error) {
        console.log("Update Supply Request Status Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update supply request status'
        });
    }
};

/**
 * @description Get vendor performance stats
 * @route GET /api/vendor/:id/stats
 * @access Private
 */
export const getVendorStats = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const totalProducts = await Product.countDocuments({
            vendor: vendor.name,
            company: companyId
        });

        const supplyRequests = await SupplyRequest.countDocuments({
            vendorId: id,
            companyId
        });

        res.status(200).json({
            success: true,
            message: 'Vendor stats fetched successfully.',
            data: {
                totalProducts,
                totalSupplyRequests: supplyRequests,
            }
        });
    } catch (error) {
        console.log("Get Vendor Stats Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor stats'
        });
    }
};

/**
 * @description Get vendor performance metrics
 * @route GET /api/vendor/:id/performance
 * @access Private
 */
export const getVendorPerformanceMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Get recent supply requests
        const recentRequests = await SupplyRequest.find({
            vendorId: id,
            companyId,
            status: 'delivered'
        }).limit(10).sort({ actualDeliveryDate: -1 });

        // Calculate metrics
        const totalRequests = await SupplyRequest.countDocuments({
            vendorId: id,
            companyId
        });

        const deliveredRequests = await SupplyRequest.countDocuments({
            vendorId: id,
            companyId,
            status: 'delivered'
        });

        const metrics = {
            vendorId: id,
            vendorName: vendor.name,
            totalSupplyRequests: totalRequests,
            deliveredRequests,
            pendingRequests: totalRequests - deliveredRequests,
            recentDeliveries: recentRequests,
        };

        res.status(200).json({
            success: true,
            message: 'Vendor performance metrics fetched successfully',
            data: metrics
        });
    } catch (error) {
        console.log("Get Vendor Performance Metrics Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor performance metrics'
        });
    }
};

/**
 * @description Get vendor dashboard
 * @route GET /api/vendor/:id/dashboard
 * @access Private
 */
export const getVendorDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId }).populate('products');
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Get all metrics
        const totalProducts = await Product.countDocuments({
            vendor: vendor.name,
            company: companyId
        });

        const totalSupplyRequests = await SupplyRequest.countDocuments({
            vendorId: id,
            companyId
        });

        const pendingSupplyRequests = await SupplyRequest.countDocuments({
            vendorId: id,
            companyId,
            status: { $in: ['pending', 'confirmed', 'shipped'] }
        });

        const deliveredSupplyRequests = await SupplyRequest.countDocuments({
            vendorId: id,
            companyId,
            status: 'delivered'
        });

        const recentSupplyRequests = await SupplyRequest.find({
            vendorId: id,
            companyId
        }).sort({ createdAt: -1 }).limit(5);

        const recentDeliveries = await SupplyRequest.find({
            vendorId: id,
            companyId,
            status: 'delivered'
        }).sort({ actualDeliveryDate: -1 }).limit(5);

        // Get most ordered products
        const orderedProducts = await Product.find({
            vendor: vendor.name,
            company: companyId
        }).sort({ _id: -1 }).limit(10);

        const dashboard = {
            vendor: {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                phone: vendor.phone,
                address: vendor.address,
                status: vendor.status,
            },
            metrics: {
                totalProducts,
                totalSupplyRequests,
                pendingRequests: pendingSupplyRequests,
                deliveredRequests: deliveredSupplyRequests,
            },
            recentActivity: {
                supplyRequests: recentSupplyRequests,
                deliveries: recentDeliveries,
            },
            products: orderedProducts,
            lastUpdated: vendor.lastPerformanceUpdate || vendor.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Vendor dashboard data fetched successfully',
            data: dashboard
        });
    } catch (error) {
        console.log("Get Vendor Dashboard Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor dashboard'
        });
    }
};

/**
 * @description Rate vendor quality
 * @route PUT /api/vendor/:id/rate
 * @access Private
 */
export const rateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, notes } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (!rating || rating < 0 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 0 and 5'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Note: Rating functionality has been simplified
        // You can extend this to track ratings separately if needed in future

        res.status(200).json({
            success: true,
            message: 'Vendor rating received successfully',
            data: vendor
        });
    } catch (error) {
        console.log("Rate Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to rate vendor'
        });
    }
};

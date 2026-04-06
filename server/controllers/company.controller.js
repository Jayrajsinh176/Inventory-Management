import Company from '../models/company.model.js';

export const companyProfile = async (req, res) => {
    try {
        const companyId = req.user.company;
        const company = await Company.findById(companyId).select('-__v');
        if (!company) {
            return res.status(404).json({ 
                success : false,
                message: 'Company not found' 
            });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

export const updateCompanyProfile = async (req, res) => {   
    try {
        const companyId = req.user.company;
        let { name, address, phone } = req.body;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                success: false,
                message: 'Company not found' 
            });
        }
        if (name) company.name = name.trim();
        if (address) company.address = address.trim();
        if (phone) company.phone = phone.trim();
        await company.save();
        res.json({ 
            success: true,
            message: 'Company profile updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/**
 * @description Get company subscription details
 * @route GET /api/company/subscription
 * @access Protected
 */
export const getCompanySubscription = async (req, res) => {
    try {
        const companyId = req.user.company;
        const company = await Company.findById(companyId).select('-__v');
        if (!company) {
            return res.status(404).json({ 
                success : false,
                message: 'Company not found' 
            });
        }
        res.json({ 
            success: true,
            subscription: company.subscription
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/**
 * @description Update company subscription plan
 * @route PATCH /api/company/subscription
 * @access Protected
 */
export const updateCompanySubscription = async (req, res) => {
    try {
        const companyId = req.user.company;
        const { planId } = req.body;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                success: false,
                message: 'Company not found' 
            });
        }
        company.subscription = planId;
        await company.save();
        res.json({ 
            success: true,
            message: 'Company subscription updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/**
 * @description Cancel company subscription
 * @route POST /api/company/subscription/cancel
 * @access Protected
 */

export const cancelCompanySubscription = async (req, res) => {
    try {
        const companyId = req.user.company;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                success: false,
                message: 'Company not found' 
            });
        }
        company.subscription = null;
        await company.save();
        res.json({ 
            success: true,
            message: 'Company subscription cancelled successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/**
 * @description Get company billing history
 * @route GET /api/company/billing-history
 * @access Protected
 */
export const getCompanyBillingHistory = async (req, res) => {
    try {
        const companyId = req.user.company;
        const company = await Company.findById(companyId).select('-__v');
        if (!company) {
            return res.status(404).json({ 
                success: false,
                message: 'Company not found' 
            });
        }
        res.json({ 
            success: true,
            billingHistory: company.billingHistory || [] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};  

/** 
 * @description Get specific invoice details from billing history
 * @route GET /api/company/billing-history/invoice/:id
 * @access Protected
 */

export const getInvoiceDetails = async (req, res) => {
    try {
        const companyId = req.user.company;
        const invoiceId = req.params.id;
        const company = await Company.findById(companyId).select('-__v');   
        if (!company) {
            return res.status(404).json({ 
                success: false,
                message: 'Company not found' 
            });
        }
        const invoice = company.billingHistory.find(invoice => invoice._id.toString() === invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found' 
            });
        }
        res.json({ 
            success: true,
            invoice 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};
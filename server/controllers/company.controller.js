import Company from "../models/company.model.js";
import { SUBSCRIPTION_PLANS } from "../utils/subscription.js";
import Subscription from "../models/Subscription.model.js";
import Notification from "../models/notification.model.js";
import Alert from "../models/alert.model.js";
import { sendEmail, getFrontendBaseUrl } from "../utils/email.js";

export const companyProfile = async (req, res) => {
  try {
    const companyId = req.user.company;
    const company = await Company.findById(companyId).select("-__v");
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Company not found",
      });
    }
    if (name) company.name = name.trim();
    if (address) company.address = address.trim();
    if (phone) company.phone = phone.trim();
    await company.save();
return res.json({
  success: true,
  message: "Company profile updated successfully",
  company,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
    const company = await Company.findById(companyId).select(
      "plan subscription_start_date subscription_end_date",
    );
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.json({
      success: true,
      subscription: company.plan,
      subscription_start_date: company.subscription_start_date,
      subscription_end_date: company.subscription_end_date,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Company not found",
      });
    }
    if (!SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const selectedPlan = SUBSCRIPTION_PLANS[planId];
    const now = new Date();
    let endDate = null;
    if (selectedPlan.durationMonths) {
      endDate = new Date(
        new Date(now).setMonth(
          new Date(now).getMonth() + selectedPlan.durationMonths,
        ),
      );
    } else if (selectedPlan.durationDays) {
      endDate = new Date(
        now.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000,
      );
    } else {
      endDate = new Date(new Date(now).setMonth(new Date(now).getMonth() + 1));
    }

    // Update company plan and subscription dates
    company.plan = planId;
    company.subscription_start_date = now;
    company.subscription_end_date = endDate;
    await company.save();

    // Create Subscription record
    const subscription = new Subscription({
      userId: req.user._id,
      companyId: company._id,
      plan: planId,
      status: planId === "trial" ? "trial" : "active",
      startDate: now,
      endDate: endDate,
    });
    await subscription.save();

    // Notify company users
    const notif = new Notification({
      company: company._id,
      type: "subscription",
      title: "Subscription updated",
      message: `Your company plan is now updated to ${selectedPlan.label}`,
      link: `${getFrontendBaseUrl()}/subscription`,
    });
    await notif.save();

    try {
      const alert = new Alert({
        company: company._id,
        type: "subscription",
        message: `Your company plan is now updated to ${selectedPlan.label}`,
        severity: "low",
      });
      await alert.save();
    } catch (e) {
      console.log(
        "Failed to create alert for company subscription update:",
        e.message,
      );
    }

    // send email if possible
    try {
      await sendEmail({
        to: company.email,
        subject: "Subscription updated",
        text: `Your company plan is now updated to ${selectedPlan.label}. Visit ${getFrontendBaseUrl()}/subscription for details.`,
        html: `<p>Your company plan is now updated to <strong>${selectedPlan.label}</strong>.</p><p><a href="${getFrontendBaseUrl()}/subscription">View subscription</a></p>`,
      });
    } catch (e) {
      console.log("Subscription update email failed:", e.message);
    }

    return res.json({
  success: true,
  message: "Company subscription updated successfully",
  company,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Company not found",
      });
    }

    const now = new Date();
   company.plan = "Basic";
    company.subscription_start_date = now;
    company.subscription_end_date = new Date(
      new Date(now).setMonth(new Date(now).getMonth() + 1),
    );
    await company.save();

    try {
      const notif = new Notification({
        company: company._id,
        type: "subscription",
        title: "Subscription cancelled",
        message:
          "Your subscription has been cancelled and downgraded to the Basic plan.",
        link: `${getFrontendBaseUrl()}/subscription`,
      });
      await notif.save();
    } catch (notifError) {
      console.log(
        "Failed to create cancel subscription notification:",
        notifError.message,
      );
    }

    try {
      const alert = new Alert({
        company: company._id,
        type: "subscription",
        message:
          "Your subscription was cancelled and has been downgraded to Basic.",
        severity: "low",
      });
      await alert.save();
    } catch (alertError) {
      console.log(
        "Failed to create cancel subscription alert:",
        alertError.message,
      );
    }

   return res.json({
  success: true,
  message: "Company subscription cancelled and downgraded to Basic",
  company,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
    const company = await Company.findById(companyId).select("-__v");
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.json({
      success: true,
      billingHistory: company.billingHistory || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
    const company = await Company.findById(companyId).select("-__v");
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    const invoice = company.billingHistory.find(
      (invoice) => invoice._id.toString() === invoiceId,
    );
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import { SUBSCRIPTION_PLANS } from "../utils/subscription.js";
import Subscription from "../models/Subscription.model.js";

/** 
 * @description Get all Subscription plan Details
 * @route GET /api/subscription/plans
 * @access Private
 */

export const getSubscriptionPlans = async (req,res) => {
    try {
        const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
            id: key,
            label: plan.label,
            maxProducts: (plan.maxProducts) ? plan.maxProducts : "unlimited",
            maxUsers: Number.isFinite(plan.maxUsers) ? plan.maxUsers : "unlimited",
            features: plan.features,
        }))
        res.status(200).json({
            success : true,
            message : "Subscription plan fetched successfully",
            data : plans
        });
    } catch (error) {
        console.log("Subscription Plan Error : ", error);

        res.status(500).json({ 
            success : false,
            message: 'Failed to fetch subscription plans' 
        });
    }
}

/** 
 * @description subscription to a plan
 * @route POST /api/subscription/subscribe
 * @acess Protected
 */

export const subscribeToPlan = async (req,res) => {
    try {
        const { planId, paymentDetails,companyDetails } = req.body;

        if (!SUBSCRIPTION_PLANS[planId]) {
            return res.status(400).json({ 
                success : false,
                message: 'Invalid subscription plan selected' 
            });
        }

        // integrate with payment gateway here (razorpay)

        const selectedPlan = SUBSCRIPTION_PLANS[planId];

        const subscriptionDetails = {
            planId,
            planLabel : selectedPlan.label,
            maxProducts : selectedPlan.maxProducts,
            maxUsers : selectedPlan.maxUsers,
            features : selectedPlan.features,
            paymentDetails,
            userId : req.user._id,
            companyId : req.user.companyId,
            status : "active",
            startDate : new Date(),
            endDate : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        }

        const subscription = new Subscription(subscriptionDetails);
        await subscription.save();
        res.status(201).json({ 
            success : true,
            message: 'Successfully subscribed to the plan' 
        });

    } catch (error) {
        console.log('Subscription Error : ', error);
        res.status(500).json({ 
            success : false,
            message: 'Failed to subscribe to the plan' 
        });
    }
}

/**
 * @description Get current subscription details
 * @route GET /api/subscription/current
 * @access Private
 */

export const getCurrentSubscription = async (req,res) =>{
    try {
        const subscription = await Subscription.findOne().sort({ createdAt: -1 });

        if(!subscription){
            return res.status(404).json({
                success : false,
                message : "No active subscription found"
            });
        }
        res.status(200).json({
            success : true,
            message : "Current subscription details fetched successfully",
            data : subscription
        });
    } catch (error) {
        console.log("Current Subscription Error : ", error);
        res.status(500).json({
            success : false,
            message: 'Failed to fetch current subscription details'
        });
    }
};

/**
 * @description Cancel subscription
 * @route POST /api/subscription/cancel
 * @access Private
 */

export const cancelSubscription = async (req,res) => {
    try {
        const subscription = await Subscription.findOne().sort({ createdAt: -1 });
        if(!subscription){
            return res.status(404).json({
                success : false,
                message : "No active subscription found"
            });
        }
        await subscription.remove();
        res.status(200).json({
            success : true,
            message : "Subscription cancelled successfully"
        });
    } catch (error) {
        console.log("Cancel Subscription Error : ", error);
        res.status(500).json({
            success : false,
            message: 'Failed to cancel subscription'
        });
    }
};


import { SUBSCRIPTION_PLANS } from "../utils/subscription";

/** 
 * @description Get all Subscription plan Details
 * @route GET /api/company/plan
 * @access Public
 */

export const planDetails = async (req,res) => {
    try {
        const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key,plan])=>({
            id: key,
            label: plan.label,
            maxProducts: (plan.maxProducts) ? plan.maxProducts : "unlimited",
            maxUsers: Number.isFinite(plan.maxUsers) ? plan.maxUsers : "unlimited",
            features: plan.features,
        }))
        return res.status(200).json({
            success : true,
            message : "Plan Fetched successfully.",
            data : plans
        })
    } catch (error){
        console.log("Plan Error : " , error);
        return res.status(500).json({
            success : false,
            message : "Internal server error",
        })
    }
    
}
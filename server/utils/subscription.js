export const SUBSCRIPTION_PLANS = {
  basic: {
    label: "Basic",
    maxProducts: 50,
    maxUsers: 1,
    features: ["inventory"],
  },
  pro: {
    label: "Pro",
    maxProducts: 500,
    maxUsers: 5,
    features: ["inventory", "alerts"],
  },
  business: {
    label: "Business",
    maxProducts: Number.POSITIVE_INFINITY,
    maxUsers: Number.POSITIVE_INFINITY,
    features: ["full_access"],
  },
  trial: {
    label: "Trial",
    maxProducts: 50,
    maxUsers: 1,
    features: ["inventory"],
  },
};

export const getSubscriptionPlan = (planName) =>
  SUBSCRIPTION_PLANS[planName] || SUBSCRIPTION_PLANS.basic;

export const canAddProductToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxProducts;
};

export const formatPlanProductLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);
  return Number.isFinite(plan.maxProducts) ? String(plan.maxProducts) : "unlimited";
};

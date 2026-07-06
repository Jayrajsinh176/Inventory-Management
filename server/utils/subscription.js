export const SUBSCRIPTION_PLANS = {
  Basic: {
    label: "Basic",
    maxProducts: 50,
    maxUsers: 3, // 1 Admin + 2 Staff
    maxLocations: 1,
    features: [
      "Inventory management",
      "Single-location stock tracking",
      "Manual order entry",
      "Email support and help docs",
    ],
    support: "Email support and knowledge base",
    priceMonthly: 499,
    durationMonths: 1,
  },

  Standard: {
    label: "Standard",
    maxProducts: 500,
    maxUsers: 5,
    maxLocations: 1,
    features: [
      "Inventory management",
      "Low stock alerts",
      "Revenue dashboard",
      "Priority email support",
    ],
    support: "Priority email support",
    priceMonthly: 999,
    durationMonths: 1,
  },

  Business: {
    label: "Business",
    maxProducts: Number.POSITIVE_INFINITY,
    maxUsers: Number.POSITIVE_INFINITY,
    maxLocations: 5,
    features: [
      "Unlimited products & users",
      "Multi-location stock visibility",
      "Advanced analytics",
      "Dedicated onboarding support",
    ],
    support: "Dedicated onboarding support",
    priceMonthly: 2999,
    durationMonths: 1,
  },

  Trial: {
    label: "Trial",
    maxProducts: 500,
    maxUsers: 5,
    maxLocations: 1,
    features: [
      "Inventory management",
      "Low stock alerts",
      "Revenue dashboard",
    ],
    support: "Email support and knowledge base",
    priceMonthly: 0,
    durationDays: 7,
  },
};

export const getSubscriptionPlan = (planName) =>
  SUBSCRIPTION_PLANS[planName] || SUBSCRIPTION_PLANS.Basic;

export const isMultiLocationStockAllowed = (planName) => {
  const plan = getSubscriptionPlan(planName);
  return plan.maxLocations > 1;
};

export const getSupportLevel = (planName) => {
  const plan = getSubscriptionPlan(planName);
  return plan.support || "Email support and knowledge base";
};

export const canAddProductToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxProducts;
};

export const canAddUsersToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxUsers;
};

export const canAddLocationToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxLocations;
};

export const formatPlanProductLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);

  return Number.isFinite(plan.maxProducts)
    ? String(plan.maxProducts)
    : "unlimited";
};

export const formatPlanUsersLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);

  return Number.isFinite(plan.maxUsers)
    ? String(plan.maxUsers)
    : "unlimited";
};

export const formatPlanLocationLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);

  return Number.isFinite(plan.maxLocations)
    ? String(plan.maxLocations)
    : "unlimited";
};

export const isAnalyticsAllowed = (planName) => {
  return (
    planName === "Standard" ||
    planName === "Business" ||
    planName === "Trial"
  );
};
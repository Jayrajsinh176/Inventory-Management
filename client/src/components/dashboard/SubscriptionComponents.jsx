import {
  MdCheckCircle,
  MdWarning,
  MdDone,
  MdReceiptLong,
} from "react-icons/md";
import { useState, useEffect } from "react";
import {
  getCurrentSubscription,
  getPlans,
  getProducts,
  getUsers,
  AuthService,
  updateSubscriptionPlan,
  getCompanyProfile,
  cancelCompanySubscription,
} from "../../api";

const CurrentPlanBanner = () => {
  const [subscription, setSubscription] = useState(null);
  const [company, setCompany] = useState(AuthService.getCompany());
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await getCurrentSubscription();
        setSubscription(response.data || response);
      } catch (error) {
        console.error("Failed to fetch subscription details:", error);
      }
    };
    fetchSubscription();
  }, []);

  useEffect(() => {
    setCompany(AuthService.getCompany());
  }, []);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  const currentPlanName = subscription?.subscription
    ? subscription.subscription.charAt(0).toUpperCase() +
    subscription.subscription.slice(1)
    : company?.plan
      ? company.plan.charAt(0).toUpperCase() + company.plan.slice(1)
      : "Basic";

  const expiryDate = subscription?.subscription_end_date
    ? new Date(subscription.subscription_end_date)
    : null;

  const daysLeft = expiryDate
    ? Math.max(
      0,
      Math.ceil(
        (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ),
    )
    : null;

  const isTrial = subscription?.subscription === "Trial";
  const trialMessage = isTrial
    ? daysLeft > 0
      ? `Your free trial expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
      : "Your trial expires today. Upgrade to keep your access."
    : "";

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelCompanySubscription();
      const updatedCompany = await getCompanyProfile();
      AuthService.setCompany(updatedCompany);
      setCompany(updatedCompany);
      const response = await getCurrentSubscription();
      setSubscription(response.data || response);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg p-6 shadow-md mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4">
            <h3 className="text-[18px] font-semibold text-[#212529]">
              {currentPlanName} Plan
            </h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4EDDA] border border-[#C3E6CB] rounded-full text-[11px] font-semibold text-[#155724]">
              <MdCheckCircle className="text-[14px]" />
              Active
            </span>
          </div>

          <div className="space-y-2 text-[14px] text-[#6C757D]">
            <p>
              Starting Date:{" "}
              <span className="font-semibold text-[#212529]">
                {subscription
                  ? formatDate(subscription.subscription_start_date)
                  : "-"}
              </span>
            </p>
            <p>
              Expiry Date:{" "}
              <span className="font-semibold text-[#212529]">
                {subscription
                  ? formatDate(subscription.subscription_end_date)
                  : "-"}
              </span>
            </p>
            {trialMessage && (
              <p className="text-[#856404] bg-[#fff3cd] border border-[#ffeeba] px-3 py-2 rounded-lg mt-2">
                {trialMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors">
            Manage Plan
          </button>
          <button
            className="px-4 py-2 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg text-[14px] font-semibold text-[#721C24] hover:bg-[#F5C6CB] transition-colors disabled:opacity-60"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

const UsageProgressBar = () => {
  const [usage, setUsage] = useState({
    products: 0,
    users: 0,
    maxProducts: 50,
    maxUsers: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setLoading(true);
        const [productsRes, usersRes] = await Promise.all([
          getProducts({ limit: 1000 }),
          getUsers({ limit: 1000 }),
        ]);

        const productCount = productsRes.count || 0;
        const userCount = usersRes.count || 0;

        const company = AuthService.getCompany();
        const planKey = company?.plan || "Basic";

        const plansRes = await getPlans();
        const plans = plansRes.data || [];
        const currentPlan = plans.find((p) => p.id === planKey);

        const maxProducts =
          currentPlan?.maxProducts === "unlimited"
            ? 1000
            : currentPlan?.maxProducts || 50;
        const maxUsers =
          currentPlan?.maxUsers === "unlimited"
            ? 1000
            : currentPlan?.maxUsers || 1;

        setUsage({
          products: productCount,
          users: userCount,
          maxProducts,
          maxUsers,
        });
      } catch (error) {
        console.error("Failed to fetch usage:", error);
        setUsage({ products: 0, users: 0, maxProducts: 50, maxUsers: 1 });
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  const productPercentage =
    usage.maxProducts > 0 ? (usage.products / usage.maxProducts) * 100 : 0;
  const userPercentage =
    usage.maxUsers > 0 ? (usage.users / usage.maxUsers) * 100 : 0;
  const isNearProductLimit = productPercentage > 80;
  const isNearUserLimit = userPercentage > 80;

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg p-6 shadow-md mb-8">
      <h3 className="text-[16px] font-semibold text-[#212529] mb-6">
        Plan Usage
      </h3>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] text-[#6C757D]">Products</span>
            <span className="text-[14px] font-semibold text-[#212529]">
              {usage.products} /{" "}
              {usage.maxProducts === 1000 ? "∞" : usage.maxProducts}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isNearProductLimit ? "bg-[#FFC107]" : "bg-[#000000]"
                }`}
              style={{ width: `${Math.min(productPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] text-[#6C757D]">Users</span>
            <span className="text-[14px] font-semibold text-[#212529]">
              {usage.users} / {usage.maxUsers === 1000 ? "∞" : usage.maxUsers}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isNearUserLimit ? "bg-[#FFC107]" : "bg-[#000000]"
                }`}
              style={{ width: `${Math.min(userPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {(isNearProductLimit || isNearUserLimit) && (
          <div className="text-[13px] text-[#6C757D] flex items-center gap-2">
            <MdWarning className="text-[16px] text-[#FFC107]" />
            <span>
              You are approaching your plan limit. Consider upgrading to the
              next tier for more capacity.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanUpgradeCards = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState("Basic");
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState(false);
const planOrder = ["Trial", "Basic", "Standard", "Business"];

const sortedPlans = [...plans].sort(
  (a, b) => planOrder.indexOf(a.id) - planOrder.indexOf(b.id)
);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const company = AuthService.getCompany();
        setCurrentPlanId(company?.plan || "Basic");

        const response = await getPlans();
        const plansData = response.data || [];
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === currentPlanId) return;
    setUpdatingPlan(true);
    try {
      await updateSubscriptionPlan(planId);
      const companyRes = await getCompanyProfile();
      const updatedCompany = companyRes?.company || companyRes;
      AuthService.setCompany(updatedCompany);
      setCurrentPlanId(updatedCompany.plan);
    } catch (err) {
      console.error("Upgrade failed:", err);
    } finally {
      setUpdatingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="text-[18px] font-semibold text-[#212529] mb-6">
          Upgrade Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md animate-pulse"
            >
              <div className="h-6 bg-[#E9ECEF] rounded w-20 mb-4"></div>
              <div className="h-4 bg-[#E9ECEF] rounded w-full mb-6"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-[#E9ECEF] rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-[18px] font-semibold text-[#212529] mb-6">
        Upgrade Options
      </h3>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
{sortedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const planPrice = plan.durationDays
            ? "Free for 7 days"
            : plan.priceMonthly
              ? `₹${plan.priceMonthly} / mo`
              : "Free";

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 shadow-sm transition-all duration-150 ${isCurrent
                ? "border-[#000000] bg-white shadow-xl"
                : "border-[#E9ECEF] bg-white hover:border-[#000000] hover:shadow-lg"
                }`}
            >
              {isCurrent && (
                <span className="inline-block px-3 py-1 bg-[#000000] text-white text-[11px] font-semibold rounded-full mb-3">
                  Current Plan
                </span>
              )}

              <h4 className="text-[20px] font-semibold text-[#212529] mb-1 capitalize">
                {plan.label}
              </h4>
              <p className="text-[13px] uppercase tracking-[0.2em] text-[#6C757D] mb-4">
                {plan.id === "Trial" ? "Trial Offer" : "Monthly plan"}
              </p>

              <div className="mb-5">
                <span className="text-[28px] font-bold text-[#212529]">
                  {planPrice}
                </span>
                <span className="block mt-2 text-[13px] text-[#6C757D]">
                  {plan.durationDays ? "7-day free trial" : "Billed monthly"}
                </span>
              </div>

              <div className="mb-5 text-[14px] text-[#495057] space-y-2">
                <p>
                  <span className="font-semibold text-[#212529]">
                    Products:
                  </span>{" "}
                  {plan.maxProducts === "unlimited" ||
                    plan.maxProducts === Infinity
                    ? "Unlimited"
                    : plan.maxProducts}
                </p>
                <p>
                  <span className="font-semibold text-[#212529]">Users:</span>{" "}
                  {plan.maxUsers === "unlimited" || plan.maxUsers === Infinity
                    ? "Unlimited"
                    : plan.maxUsers}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-[14px] font-semibold text-[#212529] mb-3">
                  What’s included
                </p>
                <ul className="space-y-3 text-[13px] text-[#6C757D]">
                  {plan.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <MdDone className="text-[16px] text-[#28A745] mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 text-[13px] text-[#6C757D]">
                <p className="font-semibold text-[#212529] mb-2">
                  Support level
                </p>
                <p>{plan.support || "Email support and knowledge base"}</p>
              </div>

              <button
                className={`w-full py-3 rounded-full text-[14px] font-semibold transition-colors ${isCurrent
                  ? "bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] cursor-not-allowed"
                  : "bg-[#000000] text-white hover:bg-[#1A1A1A]"
                  }`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || updatingPlan}
              >
                {isCurrent
                  ? "Current Plan"
                  : updatingPlan
                    ? "Updating..."
                    : plan.id === "Basic"
                      ? "Choose Basic"
                      : plan.id === "Standard"
                        ? "Upgrade to Standard"
                        : plan.id === "Business"
                          ? "Upgrade to Business"
                          : "Start Trial"}
              </button>
            </div>
          );
        })}
        <div className="rounded-2xl border border-[#E9ECEF] bg-white hover:border-black hover:shadow-lg transition-all duration-150 p-6">
          <span className="inline-block px-3 py-1 bg-[#FFF3CD] text-[#B8860B] text-[11px] font-semibold rounded-full mb-3">
            Enterprise
          </span>
          <h4 className="text-[20px] font-semibold text-[#212529] mb-1">
            Custom Plan
          </h4>

          <p className="text-[13px] uppercase tracking-[0.2em] text-[#6C757D] mb-4">
            Tailored for your business
          </p>

          <div className="mb-5">
            <span className="text-[28px] font-bold text-[#212529]">
              Contact Us
            </span>

            <span className="block mt-2 text-[13px] text-[#6C757D]">
              Custom pricing based on your requirements
            </span>
          </div>

          <div className="mb-6">
            <p className="text-[14px] font-semibold text-[#212529] mb-3">
              What's included
            </p>

            <ul className="space-y-3 text-[13px] text-[#6C757D]">
              {[
                "Unlimited products",
                "Unlimited users",
                "Unlimited locations",
                "Custom integrations",
                "API access",
                "Dedicated account manager",
                "Priority support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <MdDone className="text-[16px] text-[#28A745] mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 text-[13px] text-[#6C757D]">
            <p className="font-semibold text-[#212529] mb-2">
              Support level
            </p>

            <p>Dedicated account manager & priority support</p>
          </div>
          <button
            className="w-full py-3 rounded-full bg-[#000000] text-white hover:bg-[#1A1A1A] text-[14px] font-semibold transition-colors"
          >
            Contact Sales
          </button>
        </div>
      </div>

      <div className="mt-10 bg-white border border-[#DEE2E6] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-[#F8F9FA] border-b border-[#DEE2E6]">
          <h4 className="text-[18px] font-semibold text-[#212529]">
            What each plan covers
          </h4>
          <p className="text-[13px] text-[#6C757D] mt-1">
            Compare plan details across setup, inventory, stock, sales,
            reporting, billing, and support.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#495057]">
            <thead className="bg-[#F1F3F5]">
              <tr>
                <th className="px-6 py-3 font-semibold text-[#212529]">
                  Module
                </th>
                <th className="px-6 py-3 font-semibold text-[#212529]">
                  Basic
                </th>
                <th className="px-6 py-3 font-semibold text-[#212529]">Standard</th>
                <th className="px-6 py-3 font-semibold text-[#212529]">
                  Business
                </th>
                <th className="px-6 py-3 font-semibold text-[#212529]">
                  Custom
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "User & company setup",
                  basic: "1 admin login for one location",
                  pro: "Up to 5 staff logins with admin + staff roles",
                  business: "Unlimited users with advanced admin controls",
                },
                {
                  label: "Product management",
                  basic: "Add/edit products, SKU, one category list",
                  pro: "Bulk import and pricing tiers",
                  business:
                    "Advanced inventory rules and multi-location support",
                },
                {
                  label: "Stock tracking",
                  basic: "Single-location stock count per product",
                  pro: "Low-stock alerts and restock reminders",
                  business: "Multi-location stock visibility and transfers",
                },
                {
                  label: "Sales / orders",
                  basic: "Manual order entry with simple receipts",
                  pro: "Sales summary, order history, and quick lookup",
                  business:
                    "Multi-location sales workflows and consolidated reporting",
                },
                {
                  label: "Reporting & dashboard",
                  basic: "Basic inventory and stock value overview",
                  pro: "Revenue chart and daily sales summary",
                  business: "Cross-location analytics and exportable reports",
                },
                {
                  label: "Billing",
                  basic: "Card payment with monthly auto-renew",
                  pro: "Same as Basic + invoice history",
                  business: "GST invoices and custom billing options",
                },
                {
                  label: "Support",
                  basic: "Email support and knowledge base",
                  pro: "Priority email support",
                  business: "Dedicated onboarding call and premium support",
                },
              ].map((row) => (
                <tr key={row.label} className="border-t border-[#E9ECEF]">
                  <td className="px-6 py-4 align-top font-semibold text-[#212529]">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 align-top">{row.basic}</td>
                  <td className="px-6 py-4 align-top">{row.pro}</td>
                  <td className="px-6 py-4 align-top">{row.business}</td>
                  <td className="px-6 py-4 align-top">
                    {row.custom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = () => {
  const transactions = [
    {
      code: "PRO_PLAN_OCT_24",
      date: "October 12, 2024",
      amount: "$79.00",
      status: "paid",
    },
    {
      code: "PRO_PLAN_SEP_24",
      date: "September 12, 2024",
      amount: "$79.00",
      status: "paid",
    },
    {
      code: "PRO_PLAN_AUG_24",
      date: "August 12, 2024",
      amount: "$79.00",
      status: "paid",
    },
  ];

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-2">
        <MdReceiptLong className="text-[20px] text-[#6C757D]" />
        <h3 className="text-[18px] font-semibold text-[#212529]">
          Recent Transactions
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Transaction Code
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Date
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={index}
                className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
              >
                <td className="px-6 py-4">
                  <p className="text-[13px] font-mono font-semibold text-[#212529]">
                    {tx.code}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[#6C757D]">{tx.date}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-semibold text-[#212529]">
                    {tx.amount}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-[#D4EDDA] border border-[#C3E6CB] rounded-full text-[11px] font-semibold text-[#155724]">
                    Paid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
        <span className="text-[13px] text-[#6C757D]">
          Showing 1–4 of 12 transactions
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            ← Previous
          </button>
          <button className="px-3 py-1 bg-[#000000] text-white rounded text-[13px]">
            1
          </button>
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            2
          </button>
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export {
  CurrentPlanBanner,
  UsageProgressBar,
  PlanUpgradeCards,
  TransactionHistory,
};

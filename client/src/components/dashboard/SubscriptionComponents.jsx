import { MdCheckCircle, MdWarning, MdDone, MdReceiptLong } from 'react-icons/md';

const CurrentPlanBanner = () => {
  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg p-6 shadow-md mb-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[18px] font-semibold text-[#212529]">Pro Plan</h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4EDDA] border border-[#C3E6CB] rounded-full text-[11px] font-semibold text-[#155724]">
              <MdCheckCircle className="text-[14px]" />
              Active
            </span>
          </div>
          <div className="space-y-1 text-[14px] text-[#6C757D]">
            <p>Next billing date: <span className="font-semibold text-[#212529]">November 12, 2024</span></p>
            <p>Renewal date: <span className="font-semibold text-[#212529]">October 12, 2025</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors">
            Manage Plan
          </button>
          <button className="px-4 py-2 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg text-[14px] font-semibold text-[#721C24] hover:bg-[#F5C6CB] transition-colors">
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

const UsageProgressBar = () => {
  const used = 45;
  const total = 50;
  const percentage = (used / total) * 100;
  const isNearLimit = percentage > 80;

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg p-6 shadow-md mb-8">
      <h3 className="text-[16px] font-semibold text-[#212529] mb-6">Plan Usage</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#6C757D]">Products</span>
          <span className="text-[14px] font-semibold text-[#212529]">{used} / {total}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isNearLimit ? 'bg-[#FFC107]' : 'bg-[#000000]'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Usage Text */}
        <div className="text-[13px] text-[#6C757D] flex items-center gap-2">
          {isNearLimit && (
            <>
              <MdWarning className="text-[16px] text-[#FFC107]" />
              <span>You are approaching your product limit. Consider upgrading to Business plan.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PlanUpgradeCards = () => {
  const plans = [
    {
      name: 'Basic',
      description: 'For solo architects and hobbyists',
      price: '$29',
      period: '/month',
      features: ['Up to 10 products', 'Basic analytics', 'Email support'],
      cta: 'Downgrade',
      isCurrent: false,
    },
    {
      name: 'Pro',
      description: 'Ideal for small architectural firms',
      price: '$79',
      period: '/month',
      features: ['Up to 50 products', 'Advanced analytics', 'Priority support'],
      cta: 'Current Plan',
      isCurrent: true,
      badge: 'Current',
    },
    {
      name: 'Business',
      description: 'For large-scale enterprise workflows',
      price: '$199',
      period: '/month',
      features: ['Unlimited products', 'Custom analytics', '24/7 support'],
      cta: 'Upgrade',
      isCurrent: false,
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-[18px] font-semibold text-[#212529] mb-6">Upgrade Options</h3>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-lg border p-6 shadow-md transition-all duration-150 ${
              plan.isCurrent
                ? 'border-[#000000] bg-white shadow-xl'
                : 'border-[#DEE2E6] bg-white hover:border-[#000000]'
            }`}
          >
            {plan.badge && (
              <span className="inline-block px-3 py-1 bg-[#000000] text-white text-[11px] font-semibold rounded-full mb-3">
                {plan.badge}
              </span>
            )}

            <h4 className="text-[18px] font-semibold text-[#212529] mb-2">{plan.name}</h4>
            <p className="text-[13px] text-[#6C757D] mb-4">{plan.description}</p>

            {/* Price */}
            <div className="mb-4">
              <span className="text-[28px] font-bold text-[#212529]">{plan.price}</span>
              <span className="text-[13px] text-[#6C757D]">{plan.period}</span>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[#6C757D]">
                  <MdDone className="text-[16px] text-[#28A745] mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`w-full py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                plan.isCurrent
                  ? 'bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6]'
                  : 'bg-[#000000] text-white hover:bg-[#1A1A1A]'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TransactionHistory = () => {
  const transactions = [
    {
      code: 'PRO_PLAN_NOV_24',
      date: 'November 12, 2024',
      amount: '$79.00',
      status: 'paid',
    },
    {
      code: 'PRO_PLAN_OCT_24',
      date: 'October 12, 2024',
      amount: '$79.00',
      status: 'paid',
    },
    {
      code: 'PRO_PLAN_SEP_24',
      date: 'September 12, 2024',
      amount: '$79.00',
      status: 'paid',
    },
    {
      code: 'PRO_PLAN_AUG_24',
      date: 'August 12, 2024',
      amount: '$79.00',
      status: 'paid',
    },
  ];

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-2">
        <MdReceiptLong className="text-[20px] text-[#6C757D]" />
        <h3 className="text-[18px] font-semibold text-[#212529]">Recent Transactions</h3>
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
                  <p className="text-[13px] font-mono font-semibold text-[#212529]">{tx.code}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[#6C757D]">{tx.date}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-semibold text-[#212529]">{tx.amount}</p>
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
        <span className="text-[13px] text-[#6C757D]">Showing 1–4 of 12 transactions</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            ← Previous
          </button>
          <button className="px-3 py-1 bg-[#000000] text-white rounded text-[13px]">1</button>
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

export { CurrentPlanBanner, UsageProgressBar, PlanUpgradeCards, TransactionHistory };

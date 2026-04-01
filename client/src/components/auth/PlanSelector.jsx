import { useState } from 'react';

const plans = [
  { id: 'basic', name: 'Basic', price: '$0/mo' },
  { id: 'pro', name: 'Pro', price: '$49/mo' },
  { id: 'business', name: 'Business', price: '$199/mo' },
];

const PlanSelector = ({ selectedPlan, onSelectPlan }) => {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
        Select Architecture
      </label>
      <div className="grid grid-cols-3 gap-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              id={`plan-${plan.id}`}
              onClick={() => onSelectPlan(plan.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-[#B0C4DE] bg-[#E6F0FF]'
                  : 'border-[#DEE2E6] bg-white hover:border-[#ADB5BD]'
                }`}
            >
              <p className={`text-[14px] font-bold mb-0.5 ${isSelected ? 'text-[#1C2033]' : 'text-[#212529]'}`}>
                {plan.name}
              </p>
              <p className={`text-[13px] ${isSelected ? 'text-[#6C757D] font-semibold' : 'text-[#6C757D]'}`}>{plan.price}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelector;

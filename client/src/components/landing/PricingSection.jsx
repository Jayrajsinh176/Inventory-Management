import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '$29',
    period: '/mo',
    description: 'Perfect for small operations getting started.',
    features: ['Up to 500 Active Assets', 'Trade Workspace', 'Fixed Space'],
    cta: 'Start Trial',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    description: 'Most popular for growing businesses.',
    features: ['Unlimited Assets', '5 Brand Workspaces', '24/7 Priority Support', 'Real-time Colab Analytics'],
    cta: 'Get Started',
    featured: true,
    badge: 'Recommended',
  },
  {
    name: 'Business',
    price: '$199',
    period: '/mo',
    description: 'Enterprise-grade for large organizations.',
    features: ['Dedicated Instance', 'SSO & SAML Integration', 'Forklift Forecast', 'Audit Logs & Permissions'],
    cta: 'Contact Sales',
    featured: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-hero-lg text-[#212529] mb-4">Transparent Pricing</h2>
          <p className="text-[16px] text-[#6C757D]">Structured to grow alongside your asset portfolio</p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 justify-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex-1 max-w-sm rounded-xl p-8 border transition-all duration-300 ${
                plan.featured
                  ? 'border-2 border-black shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] scale-[1.02]'
                  : 'border-[#DEE2E6] hover:border-[#ADB5BD] hover:shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-black text-white text-[11px] font-semibold tracking-wider rounded-full uppercase">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-[14px] font-semibold text-[#6C757D] uppercase tracking-widest mb-3">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[36px] font-bold text-[#212529] leading-none">{plan.price}</span>
                <span className="text-[14px] text-[#6C757D]">{plan.period}</span>
              </div>

              <p className="text-[13px] text-[#6C757D] mb-8">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="text-[#28A745] text-[14px] flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-[14px] text-[#212529]">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/register"
                className={`block w-full py-3 text-center text-[14px] font-semibold rounded-lg transition-all duration-200 ${
                  plan.featured
                    ? 'bg-black text-white hover:bg-[#1A1A1A]'
                    : 'border border-[#DEE2E6] text-[#212529] hover:bg-[#F8F9FA] hover:border-[#ADB5BD]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

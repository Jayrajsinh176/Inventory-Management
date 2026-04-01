const steps = [
  {
    num: '01',
    title: 'Register your company',
    description:
      'Onboard your organization in seconds. Establish your workspace identity and localized settings.',
  },
  {
    num: '02',
    title: 'Add products and categories',
    description:
      'Bulk import or manually architect your product catalog with rich metadata and custom attributes.',
  },
  {
    num: '03',
    title: 'Track inventory and stock',
    description:
      'Begin monitoring inflows and outflows. Gain real-time visibility into your warehouse floor.',
  },
  {
    num: '04',
    title: 'Monitor insights and manage operations',
    description:
      'Leverage powerful analytics to optimize reorder points and reduce dead stock overhead.',
  },
];

const benefits = [
  { icon: '✦', text: 'Centralized management — Single source of truth for all channels.' },
  { icon: '✦', text: 'Preventing stockouts — Intelligent forecasting keeps shelves full.' },
  { icon: '✦', text: 'Improved decision making — Data-driven purchasing based on velocity.' },
  { icon: '✦', text: 'Simple workflows — Designed to reduce cognitive load for staff.' },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 bg-[#F8F9FA]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Steps */}
          <div className="flex-1">
            <h2 className="text-hero-lg text-[#212529] mb-12">The Implementation Path</h2>
            <div className="space-y-10">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex gap-5 group">
                  {/* Number + Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border-2 border-[#212529] rounded-full text-[12px] font-bold text-[#212529] group-hover:bg-black group-hover:text-white transition-all duration-300">
                      {step.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#DEE2E6] mt-2 min-h-[32px]"></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-[16px] font-semibold text-[#212529] mb-2">{step.title}</h3>
                    <p className="text-[14px] text-[#6C757D] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Benefits */}
          <div className="flex-shrink-0 lg:w-[340px]">
            <div className="bg-white border border-[#DEE2E6] rounded-xl p-8 shadow-[var(--shadow-md)] sticky top-24">
              <h3 className="text-[18px] font-semibold text-[#212529] mb-6">Operational Benefits</h3>
              <div className="space-y-5">
                {benefits.map((b) => (
                  <div key={b.text} className="flex items-start gap-3">
                    <span className="text-[#007BFF] text-sm mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-[14px] text-[#212529] leading-relaxed">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

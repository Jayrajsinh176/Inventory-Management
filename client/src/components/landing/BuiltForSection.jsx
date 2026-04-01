const audiences = [
  {
    title: 'Small businesses',
    description: 'Affordable and intuitive management for those moving beyond spreadsheets.',
    mockup: (
      <div className="mt-4 p-4 bg-[#F8F9FA] rounded-lg border border-[#DEE2E6]">
        <p className="text-[11px] text-[#6C757D] uppercase tracking-wider mb-2">Inventory Summary</p>
        <div className="h-6 bg-[#DEE2E6] rounded animate-pulse mb-2"></div>
        <div className="h-6 bg-[#DEE2E6] rounded animate-pulse w-3/4"></div>
      </div>
    ),
    dark: false,
  },
  {
    title: 'Retail shops',
    description: 'Point-of-sale integration and localized stock alerts.',
    mockup: null,
    dark: true,
    featured: true,
  },
  {
    title: 'E-commerce',
    description: 'Multi-warehouse syncing for high-velocity sellers.',
    mockup: null,
    dark: false,
  },
  {
    title: 'Multi-channel sellers',
    description: 'Unified inventory across Amazon, Shopify, and brick-and-mortar locations.',
    dark: false,
    hasButton: true,
  },
];

const BuiltForSection = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-hero-lg text-[#212529] mb-4">Built for Modern Commerce</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className={`rounded-xl p-6 border transition-all duration-300 ${
                audience.dark
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-[#DEE2E6] text-[#212529] hover:border-[#ADB5BD]'
              }`}
            >
              {audience.featured && (
                <span className="inline-block mb-4 px-3 py-0.5 bg-white/10 rounded-full text-[11px] text-white font-medium tracking-wide">
                  ★ Featured
                </span>
              )}
              <h3 className={`text-[15px] font-semibold mb-2 ${audience.dark ? 'text-white' : 'text-[#212529]'}`}>
                {audience.title}
              </h3>
              <p className={`text-[13px] leading-relaxed ${audience.dark ? 'text-[#9CA3AF]' : 'text-[#6C757D]'}`}>
                {audience.description}
              </p>
              {audience.mockup}
              {audience.hasButton && (
                <button className="mt-4 w-full py-2 bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-[#1A1A1A] transition-colors duration-200">
                  Explore Solution
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltForSection;

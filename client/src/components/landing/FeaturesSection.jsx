const features = [
  {
    icon: '📦',
    title: 'Product Management',
    description:
      'Add, edit, and track products effortlessly with a robust inventory system designed for scale.',
  },
  {
    icon: '📡',
    title: 'Real-time Stock Tracking',
    description:
      'Instant updates as items move across your warehouse or storefront. Never lose a unit again.',
  },
  {
    icon: '🔔',
    title: 'Low Stock Alerts',
    description:
      'Automatic notifications for reordering. Configure thresholds for every SKU in your inventory.',
  },
  {
    icon: '👥',
    title: 'Multi-user Access',
    description:
      'Manage roles with granular permissions. Separate Admin and Staff workflows with ease.',
  },
  {
    icon: '🏗️',
    title: 'Multi-tenant Architecture',
    description:
      'Completely separate and secure data isolation. Ideal for franchises and conglomerates.',
  },
  {
    icon: '💳',
    title: 'Subscription-based',
    description:
      'Scale your plan as you grow. Pay for the capacity you need without any hidden legacy costs.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section Header */}
        <div className="mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF] mb-4">
            Trusted Infrastructure
          </p>
          <h2 className="text-hero-lg text-[#212529] mb-4">Core Infrastructure</h2>
          <p className="text-[16px] text-[#6C757D] max-w-xl">
            A comprehensive set of tools designed to provide total visibility and
            control over your logistical pipeline.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 border border-[#DEE2E6] rounded-xl bg-white hover:border-black hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#F8F9FA] rounded-lg mb-5 text-xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-[16px] font-semibold text-[#212529] mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] text-[#6C757D] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

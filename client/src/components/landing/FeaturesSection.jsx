const features = [
  {
    icon: 'inventory_2',
    title: 'Product Management',
    description: 'Centralize your catalog with bulk imports, custom attributes, and rich media support.',
  },
  {
    icon: 'track_changes',
    title: 'Real-Time Tracking',
    description: 'Monitor unit movements across multiple warehouses with millisecond precision.',
  },
  {
    icon: 'notifications_active',
    title: 'Low Stock Alerts',
    description: 'Automated notifications when levels dip below your custom-set safety thresholds.',
  },
  {
    icon: 'badge',
    title: 'Role-Based Access',
    description: 'Define granular permissions for warehouse staff, managers, and external auditors.',
  },
  {
    icon: 'corporate_fare',
    title: 'Multi-Tenant Architecture',
    description: 'Manage multiple business entities or franchises under a single master account.',
  },
  {
    icon: 'credit_card',
    title: 'Subscription Plans',
    description: 'Flexible billing options that scale as your product volume and team size grows.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" style={{
      padding: '96px 24px',
      backgroundColor: '#f8f9fb',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#0c0f10',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            Everything You Need to Run Inventory Operations
          </h2>
          <div style={{ width: 64, height: 4, backgroundColor: '#455f87', margin: '0 auto', borderRadius: 2 }}></div>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }} className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
              style={{
                backgroundColor: '#ffffff',
                padding: 32,
                border: '1px solid rgba(170,179,185,0.25)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: 'default',
                borderRadius: 2,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#455f87';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(69,95,135,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(170,179,185,0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className="material-symbols-outlined" style={{
                color: '#455f87',
                fontSize: 32,
                display: 'block',
                marginBottom: 20,
              }}>{feature.icon}</span>
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: '#0c0f10',
                marginBottom: 10,
              }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: '#586065', lineHeight: 1.65 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;

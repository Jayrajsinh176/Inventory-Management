const audiences = [
  {
    icon: 'storefront',
    title: 'Retail Stores',
    description: 'Sync your front-of-house with your back-office storage effortlessly.',
  },
  {
    icon: 'shopping_cart',
    title: 'E-Commerce',
    description: 'Native integrations with Shopify, WooCommerce, and Amazon.',
  },
  {
    icon: 'factory',
    title: 'Wholesale',
    description: 'Manage bulk orders, tiered pricing, and large-scale shipping.',
  },
  {
    icon: 'hub',
    title: 'Multi-Channel',
    description: 'Centralize inventory data from multiple physical and digital locations.',
  },
];

const BuiltForSection = () => {
  return (
    <section id="built-for" style={{
      padding: '96px 24px',
      backgroundColor: '#0c0f10',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
          color: '#ffffff',
          marginBottom: 64,
          letterSpacing: '-0.02em',
        }}>
          Built for Every Model
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }} className="built-for-grid">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              style={{
                padding: 32,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                transition: 'background-color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{
                color: '#adc8f5',
                fontSize: 32,
                display: 'block',
                marginBottom: 16,
                fontVariationSettings: "'FILL' 1",
              }}>{audience.icon}</span>
              <h4 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: '#ffffff',
                marginBottom: 8,
              }}>
                {audience.title}
              </h4>
              <p style={{ fontSize: 14, color: '#737c81', lineHeight: 1.65 }}>
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .built-for-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .built-for-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default BuiltForSection;

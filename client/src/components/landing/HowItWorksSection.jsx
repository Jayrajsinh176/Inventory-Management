const steps = [
  {
    icon: 'app_registration',
    num: 1,
    title: 'Register Company',
    description: 'Create your organization profile and invite your core leadership team.',
  },
  {
    icon: 'library_add',
    num: 2,
    title: 'Add Products',
    description: 'Upload your SKU catalog or sync directly with your sales channels.',
  },
  {
    icon: 'analytics',
    num: 3,
    title: 'Track Inventory',
    description: 'Monitor inflows and outflows with automated barcode scanning and logging.',
  },
  {
    icon: 'query_stats',
    num: 4,
    title: 'Manage & Grow',
    description: 'Use data insights to optimize reorder points and maximize capital efficiency.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" style={{
      padding: '96px 24px',
      backgroundColor: '#f1f4f7',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
          color: '#0c0f10',
          marginBottom: 80,
          letterSpacing: '-0.02em',
        }}>
          Scale Your Operations in 4 Steps
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 48,
        }} className="steps-grid">
          {steps.map((step) => (
            <div key={step.num} style={{ position: 'relative' }}>
              {/* Big ghost number */}
              <span style={{
                position: 'absolute',
                top: -40,
                left: -16,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: 72,
                color: 'rgba(69,95,135,0.08)',
                userSelect: 'none',
                lineHeight: 1,
              }}>{step.num}</span>

              {/* Icon box */}
              <div style={{
                width: 64,
                height: 64,
                backgroundColor: '#455f87',
                color: '#f6f7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                boxShadow: '0 8px 20px rgba(69,95,135,0.25)',
                marginBottom: 24,
                position: 'relative',
                zIndex: 1,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 30 }}>{step.icon}</span>
              </div>

              <h4 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: '#0c0f10',
                marginBottom: 8,
              }}>
                {step.title}
              </h4>
              <p style={{ fontSize: 14, color: '#586065', lineHeight: 1.65 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;

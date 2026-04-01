const trustItems = [
  {
    icon: 'key',
    title: 'JWT Authentication',
    description: 'Secure, token-based authentication for every session and API call.',
  },
  {
    icon: 'dataset',
    title: 'Data Isolation',
    description: "Each organization's data is logically separated for maximum privacy.",
  },
  {
    icon: 'admin_panel_settings',
    title: 'RBAC Control',
    description: 'Standardized role-based access to prevent unauthorized data leakage.',
  },
];

const TrustSection = () => {
  return (
    <section style={{
      padding: '96px 24px',
      backgroundColor: '#f8f9fb',
      borderBottom: '1px solid rgba(170,179,185,0.2)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 48,
        textAlign: 'center',
      }} className="trust-grid">
        {trustItems.map((item) => (
          <div key={item.title}>
            <span className="material-symbols-outlined" style={{
              color: '#455f87',
              fontSize: 40,
              display: 'block',
              marginBottom: 16,
            }}>{item.icon}</span>
            <h4 style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: '#0c0f10',
              marginBottom: 8,
            }}>
              {item.title}
            </h4>
            <p style={{ fontSize: 14, color: '#586065', lineHeight: 1.65 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default TrustSection;

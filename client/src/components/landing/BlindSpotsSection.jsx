const benefits = [
  {
    icon: 'trending_down',
    title: 'Prevent Stockouts',
    description: 'Intelligent forecasts ensure you never run out of your best sellers.',
  },
  {
    icon: 'sync_disabled',
    title: 'Eliminate Overselling',
    description: 'Real-time sync across channels prevents double-selling inventory.',
  },
  {
    icon: 'bolt',
    title: 'Faster Operations',
    description: 'Streamlined workflows for receiving, counting, and picking orders.',
  },
  {
    icon: 'security',
    title: 'Data You Can Trust',
    description: 'Every action is logged with an immutable audit trail for total accountability.',
  },
];

const BlindSpotsSection = () => {
  return (
    <section style={{
      padding: '96px 24px',
      backgroundColor: '#f8f9fb',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        alignItems: 'center',
      }} className="blindspots-grid">
        {/* Left */}
        <div>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#0c0f10',
            marginBottom: 24,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}>
            Eliminate Inventory Blind Spots Permanently
          </h2>
          <p style={{ fontSize: 17, color: '#586065', lineHeight: 1.7, marginBottom: 32 }}>
            StockFlow provides the infrastructure needed to turn complex logistics into a competitive advantage. Stop guessing where your capital is tied up and start making data-driven procurement decisions.
          </p>

          {/* Quote */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 16,
            backgroundColor: 'rgba(213, 227, 255, 0.3)',
            borderLeft: '4px solid #455f87',
            borderRadius: '0 8px 8px 0',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#455f87', flexShrink: 0 }}>verified</span>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#385379',
              fontStyle: 'italic',
            }}>
              "Reduced our stockout incidents by 64% in the first quarter." — Logistics Lead, AeroTech
            </span>
          </div>
        </div>

        {/* Right: Benefits grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}>
          {benefits.map((b) => (
            <div key={b.title} style={{
              backgroundColor: '#ffffff',
              padding: 24,
              borderRadius: 8,
              border: '1px solid rgba(170,179,185,0.15)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(69,95,135,0.1)',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                color: '#455f87',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{b.icon}</span>
              </div>
              <h4 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 15,
                color: '#0c0f10',
                marginBottom: 8,
              }}>{b.title}</h4>
              <p style={{ fontSize: 13, color: '#586065', lineHeight: 1.6 }}>{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .blindspots-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
};

export default BlindSpotsSection;

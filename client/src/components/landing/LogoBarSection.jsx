const LogoBarSection = () => {
  const logos = [
    { name: 'Company A', w: 128, h: 32 },
    { name: 'Company B', w: 112, h: 24 },
    { name: 'Company C', w: 144, h: 40 },
    { name: 'Company D', w: 128, h: 28 },
    { name: 'Company E', w: 96, h: 32 },
  ];

  return (
    <section style={{
      backgroundColor: '#f8f9fb',
      padding: '64px 24px',
      borderTop: '1px solid rgba(170,179,185,0.2)',
      borderBottom: '1px solid rgba(170,179,185,0.2)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: '#aab3b9',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 40,
        }}>
          Trusted by modern logistics and retail giants
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 48,
          opacity: 0.5,
          filter: 'grayscale(1)',
        }}>
          {logos.map((logo) => (
            <div
              key={logo.name}
              style={{
                width: logo.w,
                height: logo.h,
                backgroundColor: '#94a3b8',
                borderRadius: 2,
              }}
              aria-label={logo.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoBarSection;

const Footer = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: '#0c0f10', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }} className="footer-inner">
        {/* Logo */}
        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 20, color: '#ffffff' }}>
          StockFlow
        </div>

        {/* Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
          {[
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Security', href: '#' },
            { label: 'Status', href: '#' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#94a3b8' }}>
          © 2024 StockFlow Inc. All rights reserved.
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-inner {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

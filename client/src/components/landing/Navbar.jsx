import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      backgroundColor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.08)' : 'none',
      transition: 'box-shadow 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 20,
          color: '#1E3A5F',
          letterSpacing: '-0.02em',
        }}>
          <span className="material-symbols-outlined" style={{
            color: '#455f87',
            fontSize: 24,
            fontVariationSettings: "'FILL' 1",
          }}>inventory_2</span>
          StockFlow
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
          {[
            { label: 'Features', id: 'features' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'For Teams', id: 'built-for' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: '#586065',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                padding: 0,
              }}
              onMouseEnter={e => e.target.style.color = '#455f87'}
              onMouseLeave={e => e.target.style.color = '#586065'}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden-mobile">
          <Link
            to="/login"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: '#586065',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#455f87'}
            onMouseLeave={e => e.currentTarget.style.color = '#586065'}
          >
            Log In
          </Link>
          <Link
            to="/register"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: '#f6f7ff',
              backgroundColor: '#455f87',
              padding: '10px 22px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'background-color 0.2s, transform 0.1s',
              display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#39537a'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#455f87'; }}
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'none' }}
          className="show-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ display: 'block', width: 22, height: 2, backgroundColor: '#2b3438', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ display: 'block', width: 22, height: 2, backgroundColor: '#2b3438', borderRadius: 2, transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }}></span>
            <span style={{ display: 'block', width: 22, height: 2, backgroundColor: '#2b3438', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
          </div>
        </button>
      </div>

      {/* Bottom divider */}
      <div style={{ height: 1, backgroundColor: '#f1f4f7', width: '100%' }}></div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#fff', borderTop: '1px solid #eaeef2', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'For Teams', id: 'built-for' },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#586065', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
              {label}
            </button>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: '1px solid #eaeef2' }}>
            <Link to="/login" style={{ fontSize: 14, color: '#586065', textDecoration: 'none' }}>Log In</Link>
            <Link to="/register" style={{ fontSize: 14, fontWeight: 700, color: '#f6f7ff', backgroundColor: '#455f87', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', textAlign: 'center' }}>Get Started Free</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

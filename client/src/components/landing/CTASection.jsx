import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CTASection = () => {
  return (
    <section style={{
      padding: '96px 24px',
      backgroundColor: '#1E3A5F',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#ffffff',
          marginBottom: 24,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}>
          Start Managing Your Inventory Today.
        </h2>
        <p style={{
          fontSize: 18,
          color: '#bed6ff',
          marginBottom: 48,
          maxWidth: 520,
          margin: '0 auto 48px',
          lineHeight: 1.65,
        }}>
          Join over 2,500+ businesses who have streamlined their operations with StockFlow.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          <Link
            to="/register"
            style={{
              backgroundColor: '#ffffff',
              color: '#1E3A5F',
              padding: '18px 40px',
              borderRadius: 8,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
              transition: 'background-color 0.2s, transform 0.1s',
              display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f4f7'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
          >
            Get Started Free
          </Link>
          <button
            onClick={() => toast('Demo booking coming soon!')}
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              backgroundColor: 'transparent',
              padding: '18px 40px',
              borderRadius: 8,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

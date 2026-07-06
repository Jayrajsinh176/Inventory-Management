import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '₹499',
    period: '/mo',
    features: [
      { text: '50 Products', included: true },
      { text: '2 Team Members', included: true },
      { text: 'Real-time Tracking', included: true },
      { text: 'Advanced Analytics', included: false },
    ],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Standard',
    price: '₹999',
    period: '/mo',
    features: [
      { text: '500 Products', included: true },
      { text: '10 Team Members', included: true },
      { text: 'Low Stock Alerts', included: true },
      { text: 'API Access', included: true },
    ],
    cta: 'Select Standard',
    featured: true,
    badge: 'Recommended',
  },
  {
    name: 'Business',
    price: '₹2999',
    period: '/mo',
    features: [
      { text: 'Unlimited Products', included: true },
      { text: 'Unlimited Team Members', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Custom Integrations', included: true },
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" style={{
      padding: '96px 24px',
      backgroundColor: '#f1f4f7',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#0c0f10',
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}>
            Pricing Built to Scale
          </h2>
          <p style={{ fontSize: 16, color: '#586065' }}>Start free and upgrade as your warehouse grows.</p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          alignItems: 'end',
          maxWidth: 960,
          margin: '0 auto',
        }} className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                backgroundColor: '#ffffff',
                padding: plan.featured ? 36 : 32,
                borderRadius: 12,
                border: plan.featured ? `4px solid #455f87` : '1px solid rgba(170,179,185,0.25)',
                borderTop: plan.featured ? '4px solid #455f87' : '1px solid rgba(170,179,185,0.25)',
                boxShadow: plan.featured ? '0 20px 40px rgba(69,95,135,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                transform: plan.featured ? 'scale(1.04)' : 'none',
                position: 'relative',
                zIndex: plan.featured ? 2 : 1,
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#455f87',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '4px 16px',
                  borderRadius: 20,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: '#0c0f10',
                marginBottom: 8,
              }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 40,
                  color: '#0c0f10',
                  lineHeight: 1,
                }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 14, color: '#737c81', fontWeight: 500 }}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {plan.features.map((f) => (
                  <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: 18,
                      color: f.included ? '#16a34a' : '#d1dce2',
                      flexShrink: 0,
                    }}>
                      {f.included ? 'check_circle' : 'cancel'}
                    </span>
                    <span style={{
                      fontSize: 14,
                      color: f.included ? '#2b3438' : '#aab3b9',
                      fontWeight: plan.featured ? 600 : 400,
                    }}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/register"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: plan.featured ? '16px 0' : '12px 0',
                  textAlign: 'center',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  borderRadius: 8,
                  transition: 'all 0.2s',
                  backgroundColor: plan.featured ? '#455f87' : 'transparent',
                  color: plan.featured ? '#f6f7ff' : '#455f87',
                  border: plan.featured ? 'none' : '2px solid #455f87',
                  boxShadow: plan.featured ? '0 4px 15px rgba(69,95,135,0.25)' : 'none',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  if (plan.featured) {
                    e.currentTarget.style.backgroundColor = '#39537a';
                  } else {
                    e.currentTarget.style.backgroundColor = 'rgba(69,95,135,0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (plan.featured) {
                    e.currentTarget.style.backgroundColor = '#455f87';
                  } else {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > * { transform: none !important; }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;

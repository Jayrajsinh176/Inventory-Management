import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <header style={{
      paddingTop: 128,
      paddingBottom: 96,
      paddingLeft: 24,
      paddingRight: 24,
      backgroundColor: '#f8f9fb',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
      }} className="hero-grid">

        {/* Left: Text Content */}
        <div>
          <span style={{
            color: '#455f87',
            fontWeight: 700,
            letterSpacing: '0.1em',
            fontSize: 11,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 16,
            fontFamily: 'Inter, sans-serif',
          }}>
            Inventory Management for Modern Teams
          </span>

          <h1 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            color: '#0c0f10',
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            Manage Every Product.<br />
            Track Every Unit.<br />
            <span style={{ color: '#455f87' }}>Run Smarter.</span>
          </h1>

          <p style={{
            fontSize: 17,
            color: '#586065',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 480,
            fontFamily: 'Inter, sans-serif',
          }}>
            StockFlow is a centralized inventory platform built for growing businesses. Add products, monitor stock levels, get low-stock alerts, and manage your team — all in one place.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Link
              to="/register"
              style={{
                backgroundColor: '#455f87',
                color: '#f6f7ff',
                padding: '16px 32px',
                borderRadius: 8,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(69,95,135,0.3)',
                transition: 'background-color 0.2s, transform 0.1s',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#39537a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#455f87'; e.currentTarget.style.transform = 'none'; }}
            >
              Get Started Free
            </Link>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                color: '#455f87',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 32px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              See How It Works
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right: Dashboard Preview Mock */}
        <div style={{ position: 'relative' }}>
          {/* Browser mockup */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: '1px solid rgba(170,179,185,0.15)',
          }}>
            {/* Browser chrome */}
            <div style={{
              backgroundColor: '#eaeef2',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid rgba(170,179,185,0.15)',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(252,100,100,0.3)', border: '1px solid rgba(252,100,100,0.5)' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(255,189,68,0.3)', border: '1px solid rgba(255,189,68,0.5)' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(72,199,142,0.3)', border: '1px solid rgba(72,199,142,0.5)' }}></div>
              </div>
              <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 10,
                color: '#737c81',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                backgroundColor: '#ffffff',
                borderRadius: 4,
                padding: '4px 16px',
                margin: '0 24px',
                letterSpacing: '0.03em',
              }}>
                stockflow.app/dashboard
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{ padding: 24, backgroundColor: '#f8f9fb' }}>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div style={{ backgroundColor: '#d5e3ff', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#385379', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>Total Stock</div>
                  <div style={{ fontSize: 22, fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#385379' }}>12,482</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e9ee' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#586065', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>Low Stock</div>
                  <div style={{ fontSize: 22, fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#9f403d' }}>14</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e9ee' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#586065', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>Incoming</div>
                  <div style={{ fontSize: 22, fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#2b3438' }}>542</div>
                </div>
              </div>

              {/* Recent Inventory mini-table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#586065' }}>Recent Inventory</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#455f87' }}>View All</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid rgba(170,179,185,0.15)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #eaeef2', backgroundColor: '#f1f4f7' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#2b3438' }}>Product Name</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#2b3438' }}>SKU</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#2b3438' }}>Status</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#2b3438' }}>Stock</th>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f4f7' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 500, color: '#2b3438' }}>Nike Air Max 270</td>
                        <td style={{ padding: '10px 12px', color: '#737c81' }}>NK-AM-270-BLK</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ padding: '2px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>In Stock</span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#2b3438' }}>48</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 12px', fontWeight: 500, color: '#2b3438' }}>Samsung T5 SSD 1TB</td>
                        <td style={{ padding: '10px 12px', color: '#737c81' }}>SS-T5-1TB-BLU</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ padding: '2px 8px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>Critical</span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#9f403d' }}>2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Floating trend card */}
          <div style={{
            position: 'absolute',
            bottom: -24,
            left: -24,
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            border: '1px solid rgba(170,179,185,0.15)',
          }} className="hero-float-card">
            <div style={{ fontSize: 10, fontWeight: 700, color: '#737c81', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Trend Analysis</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
              {[4, 6, 8, 12, 10].map((h, i) => (
                <div key={i} style={{
                  width: 8,
                  height: `${h * 4}px`,
                  backgroundColor: i === 3 ? '#455f87' : '#d5e3ff',
                  borderRadius: '2px 2px 0 0',
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-float-card { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default HeroSection;

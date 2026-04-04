const DashboardPreviewSection = () => {
  return (
    <section style={{
      padding: '96px 24px',
      overflow: 'hidden',
      backgroundColor: '#f8f9fb',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 48,
        }}>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#0c0f10',
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}>
            A Dashboard Built for Clarity
          </h2>
          <p style={{ fontSize: 16, color: '#586065' }}>
            Everything your team needs, organized in a single powerful view.
          </p>
        </div>

        {/* Browser frame */}
        <div style={{
          borderRadius: 12,
          border: '1px solid rgba(170,179,185,0.25)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}>
          {/* Browser chrome */}
          <div style={{
            height: 40,
            backgroundColor: '#eaeef2',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            borderBottom: '1px solid rgba(170,179,185,0.2)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#d1dce2' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#d1dce2' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#d1dce2' }}></div>
            </div>
          </div>

          {/* Dashboard preview image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSV0HQzYwuGRPXLSLh0LNsxgX-9BwW_PVsYRWQsxmZQX1kwOL2boQ-ojh0eBqfr1Vl0apC4LVze_1f4pb-v-jeWe41ODPeyhWCMZ62tYzW7ubgIZhkRWnOfvomdL4IzGmSOgGluv42GDhIC9FmNDu-OVhu-RSz4eGTpbIUPuJ403mxadjtnvY7h4DWLgduhpq3F3SMZoDVjANIRBeI5jp8EE5q68u2QCAvjHVDXuDPU5aE7mZb8J-78hO9L8Rn9P8uQD_p-9x5CYsf"
            alt="StockFlow Dashboard Preview"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onError={e => {
              // Fallback: show a placeholder dashboard mockup
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback if image fails */}
          <div style={{
            display: 'none',
            backgroundColor: '#f8f9fb',
            padding: 48,
            textAlign: 'center',
            color: '#586065',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#d1dce2', display: 'block', marginBottom: 12 }}>dashboard</span>
            Dashboard Preview
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;

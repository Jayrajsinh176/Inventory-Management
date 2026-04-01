import { Link } from 'react-router-dom';
import dashboardImage from '../../images/deshboard.png';

const HeroSection = () => {
  return (
    <section className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden">
      {/* Background subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-[1200px] w-full mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="text-[#9CA3AF] text-[12px] font-medium tracking-wide uppercase">
              Structural Integrity for Inventory
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-hero-xl text-white mb-6 max-w-xl lg:max-w-none">
            Manage Your Inventory{' '}
            <span className="text-white">Across All</span>{' '}
            <br />
            <span className="text-white">Channels in One Place</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-[#9CA3AF] leading-relaxed mb-10 max-w-lg">
            Track stock, manage products, monitor low inventory, and streamline
            your business operations with a centralized system.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-black font-semibold text-[14px] rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-lg"
            >
              Get Started
            </Link>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[14px] text-[#9CA3AF] hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              View Demo <span>→</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 lg:justify-start justify-center">
            {['SENTRY_DATA', 'ISO_SECURE', 'VPC_LOCK', 'AUTH_ZERO'].map((badge) => (
              <span
                key={badge}
                className="text-[11px] font-mono text-[#4B5563] tracking-widest"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Dashboard Preview Image */}
        <div className="flex-1 max-w-2xl w-full">
          <img 
            src={dashboardImage} 
            alt="Dashboard Preview" 
            className="w-full rounded-2xl shadow-2xl border border-white/10 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import LogoBarSection from '../components/landing/LogoBarSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import BlindSpotsSection from '../components/landing/BlindSpotsSection';
import PricingSection from '../components/landing/PricingSection';
import BuiltForSection from '../components/landing/BuiltForSection';
import TrustSection from '../components/landing/TrustSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sticky top navigation */}
      <Navbar />

      {/* Light hero with dashboard mock */}
      <HeroSection />

      {/* Trusted by brands */}
      <LogoBarSection />

      {/* Core features grid */}
      <FeaturesSection />

      {/* How it works — step-by-step */}
      <HowItWorksSection />

      {/* Dashboard preview */}
      <DashboardPreviewSection />

      {/* Blind spots / benefits */}
      <BlindSpotsSection />

      {/* Pricing tiers */}
      <PricingSection />

      {/* Built for every model */}
      <BuiltForSection />

      {/* Trust / Security */}
      <TrustSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import BuiltForSection from '../components/landing/BuiltForSection';
import PricingSection from '../components/landing/PricingSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Sticky top navigation */}
      <Navbar />

      {/* Full-bleed dark hero */}
      <HeroSection />

      {/* Core features grid */}
      <FeaturesSection />

      {/* How it works — step-by-step */}
      <HowItWorksSection />

      {/* Built for modern commerce */}
      <BuiltForSection />

      {/* Pricing tiers */}
      <PricingSection />

      {/* Final CTA dark section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="bg-[#0A0A0A] py-32 px-6">
      <div className="max-w-[1200px] mx-auto text-center">
        {/* Headline */}
        <h2 className="text-hero-lg text-white mb-6">
          Start Managing Your Inventory Today
        </h2>
        <p className="text-[16px] text-[#9CA3AF] mb-10 max-w-xl mx-auto">
          Join thousands of companies architecturalizing their logistics with precision and silence.
        </p>
        <Link
          to="/register"
          className="inline-block px-10 py-4 bg-white text-black font-semibold text-[15px] rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-xl"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default CTASection;

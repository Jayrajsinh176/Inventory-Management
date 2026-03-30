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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 backdrop-blur-md bg-[#0A0A0A]/95' : 'bg-[#0A0A0A]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">A</span>
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">
            Silent Architect
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['features', 'how-it-works', 'pricing'].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-[14px] text-[#9CA3AF] hover:text-white transition-colors duration-200 capitalize"
            >
              {id === 'how-it-works' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-[14px] text-[#9CA3AF] hover:text-white transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-white text-black text-[14px] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-white/10 px-8 py-6 flex flex-col gap-4">
          {['features', 'how-it-works', 'pricing'].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-[14px] text-[#9CA3AF] hover:text-white text-left transition-colors"
            >
              {id === 'how-it-works' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <Link to="/login" className="text-[14px] text-[#9CA3AF] hover:text-white">Login</Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-white text-black text-[14px] font-semibold rounded-lg text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

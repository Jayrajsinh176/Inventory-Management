const Footer = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] border-t border-white/5 py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-xs">A</span>
              </div>
              <span className="text-white font-semibold text-[14px]">Silent Architect</span>
            </div>
            <p className="text-[13px] text-[#4B5563] leading-relaxed">
              Professional inventory management for the modern enterprise.
            </p>
          </div>

          {/* Features column */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#6C757D] mb-4">
              Features
            </h4>
            <ul className="space-y-2.5">
              {['Product Management', 'Stock Tracking', 'Low Stock Alerts', 'Multi-user Access'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo('features')}
                    className="text-[13px] text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing column */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#6C757D] mb-4">
              Pricing
            </h4>
            <ul className="space-y-2.5">
              {['Basic — $29/mo', 'Pro — $79/mo', 'Business — $199/mo'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo('pricing')}
                    className="text-[13px] text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#6C757D] mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Support Center', 'Documentation', 'Status Page'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#4B5563]">
            © 2024 The Silent Architect Inventory. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Features', 'Pricing', 'Contact'].map((link) => (
              <a key={link} href="#" className="text-[12px] text-[#4B5563] hover:text-[#6C757D] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

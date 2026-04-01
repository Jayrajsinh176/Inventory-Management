const SignupBranding = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Logo Icon */}
      <div className="w-14 h-14 bg-[#1C2033] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
        <span className="text-white font-bold text-xl tracking-tighter">A</span>
      </div>

      {/* Brand Name */}
      <h1 className="text-[24px] font-bold text-[#212529] mb-2">
        Silent Architect
      </h1>

      {/* Sub-brand */}
      <p className="text-[14px] text-[#6C757D]">
        Enterprise Inventory Control Systems
      </p>
    </div>
  );
};

export default SignupBranding;

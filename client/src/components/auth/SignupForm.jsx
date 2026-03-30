import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlanSelector from './PlanSelector';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to registration API
    setTimeout(() => setLoading(false), 1500);
  };

  const inputClass =
    'w-full h-[44px] px-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200';

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2';

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-[#DEE2E6] p-10 w-full max-w-[500px]">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-[22px] font-semibold text-[#212529] mb-1">Create your account</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div>
          <label htmlFor="signup-company" className={labelClass}>Company Name</label>
          <input
            id="signup-company"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Architectural Labs Inc."
            required
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className={labelClass}>Email Address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#6C757D] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {/* Plan Selector */}
        <PlanSelector selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />

        {/* Submit Button */}
        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="w-full h-[52px] bg-[#1C2033] text-white font-semibold text-[15px] rounded-xl hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Account...
            </>
          ) : (
            <>Register Account <span>→</span></>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-[14px] text-[#6C757D]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#212529] hover:text-black underline-offset-2 hover:underline transition-all"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;

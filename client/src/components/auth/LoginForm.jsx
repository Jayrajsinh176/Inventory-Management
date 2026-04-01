import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to authentication API
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-[#DEE2E6] p-10 w-full max-w-[480px]">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-[22px] font-semibold text-[#212529] mb-1">System Access</h2>
        <p className="text-[14px] text-[#6C757D]">
          Please enter your credentials to manage inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
            Email Address
          </label>
          <div className="relative">
            {/* Email icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]" aria-hidden="true">
              ✉
            </span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              className="w-full h-[44px] pl-10 pr-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
              Security Key
            </label>
            <a
              href="#"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] hover:text-[#212529] transition-colors"
            >
              Forgot?
            </a>
          </div>
          <div className="relative">
            {/* Lock icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]" aria-hidden="true">
              🔒
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-[44px] pl-10 pr-10 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200"
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

        {/* Submit Button */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="w-full h-[48px] bg-[#1C2033] text-white font-semibold text-[13px] uppercase tracking-[0.1em] rounded-lg hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Authorizing...
            </span>
          ) : (
            'Authorize Access'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-[#DEE2E6]"></div>
          <span className="text-[12px] text-[#ADB5BD] tracking-widest">OR</span>
          <div className="flex-1 h-px bg-[#DEE2E6]"></div>
        </div>

        {/* Register link */}
        <p className="text-center text-[14px] text-[#6C757D]">
          New organization?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#212529] hover:text-black underline-offset-2 hover:underline transition-all"
          >
            Register Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdError, MdVisibility, MdVisibilityOff, MdLock, MdEmail } from 'react-icons/md';
import { loginUser } from '../../api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    
    // If contains @, treat as email - allow any input
    if (value.includes('@')) {
      setIdentifier(value);
    } else {
      // Treat as phone - remove non-digits and limit to 10
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setIdentifier(digitsOnly);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isEmail = identifier.includes('@');

      const response = await loginUser(
        isEmail ? identifier : null, // email
        !isEmail ? identifier : null, // phone
        password
      );

      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
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

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-4 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg">
          <p className="text-[13px] text-[#721C24] flex items-center gap-2">
            <MdError className="text-[16px]" />
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
            Email or Phone
          </label>
          <div className="relative">
            {/* Email icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]" aria-hidden="true">
              <MdEmail size={18} />
            </span>
            <input
              id="login-email"
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder="Email or 10-digit Phone"
              required
              disabled={loading}
              maxLength="100"
              className="w-full h-[44px] pl-10 pr-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] hover:text-[#212529] transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            {/* Lock icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]" aria-hidden="true">
              <MdLock size={18} />
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full h-[44px] pl-10 pr-10 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#6C757D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
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

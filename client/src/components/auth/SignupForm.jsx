import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.company_name.trim()) errors.company_name = 'Company name is required';
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.address.trim()) errors.address = 'Address is required';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);
      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Check if error is about existing email/phone
      if (err.message.includes('already exists')) {
        setError(err.message);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const inputClass =
    'w-full h-[44px] px-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2';

  const errorLabelClass = 'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#721C24] mb-2';

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-[#DEE2E6] p-10 w-full max-w-[500px]">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-[22px] font-semibold text-[#212529] mb-1">Create your account</h2>
        <p className="text-[14px] text-[#6C757D]">Set up your inventory management system today</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-4 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg">
          <p className="text-[13px] text-[#721C24]">
            <i className="material-symbols-rounded text-[16px] align-middle mr-2">error</i>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div>
          <label htmlFor="signup-company" className={fieldErrors.company_name ? errorLabelClass : labelClass}>
            Company Name {fieldErrors.company_name && '- ' + fieldErrors.company_name}
          </label>
          <input
            id="signup-company"
            name="company_name"
            type="text"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Architectural Labs Inc."
            disabled={loading}
            className={`${inputClass} ${fieldErrors.company_name ? 'border-[#DC3545]' : ''}`}
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="signup-name" className={fieldErrors.name ? errorLabelClass : labelClass}>
            Full Name {fieldErrors.name && '- ' + fieldErrors.name}
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={loading}
            className={`${inputClass} ${fieldErrors.name ? 'border-[#DC3545]' : ''}`}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className={fieldErrors.email ? errorLabelClass : labelClass}>
            Email Address {fieldErrors.email && '- ' + fieldErrors.email}
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            disabled={loading}
            className={`${inputClass} ${fieldErrors.email ? 'border-[#DC3545]' : ''}`}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="signup-phone" className={fieldErrors.phone ? errorLabelClass : labelClass}>
            Phone Number {fieldErrors.phone && '- ' + fieldErrors.phone}
          </label>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            disabled={loading}
            className={`${inputClass} ${fieldErrors.phone ? 'border-[#DC3545]' : ''}`}
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="signup-address" className={fieldErrors.address ? errorLabelClass : labelClass}>
            Business Address {fieldErrors.address && '- ' + fieldErrors.address}
          </label>
          <input
            id="signup-address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, City, State 12345"
            disabled={loading}
            className={`${inputClass} ${fieldErrors.address ? 'border-[#DC3545]' : ''}`}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className={fieldErrors.password ? errorLabelClass : labelClass}>
            Password {fieldErrors.password && '- ' + fieldErrors.password}
          </label>
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              minLength={6}
              className={`${inputClass} pr-10 ${fieldErrors.password ? 'border-[#DC3545]' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#6C757D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
          {!fieldErrors.password && (
            <p className="text-[12px] text-[#6C757D] mt-1">Minimum 6 characters</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="w-full h-[52px] bg-[#1C2033] text-white font-semibold text-[15px] rounded-xl hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
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

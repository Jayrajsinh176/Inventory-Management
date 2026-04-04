import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdError, MdVisibility, MdVisibilityOff } from 'react-icons/md';
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
    
    // Limit phone to 10 digits only
    if (name === 'phone') {
      const phoneOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: phoneOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
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
    'w-full h-[36px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[12px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[2px] focus:ring-black/8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const labelClass =
    'block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] mb-1';

  const errorLabelClass = 'block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#721C24] mb-1';

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-[#DEE2E6] p-5 w-full max-w-[480px]">
      {/* Form Header */}
      <div className="mb-3">
        <h2 className="text-[18px] font-semibold text-[#212529] mb-0.5">Create your account</h2>
        <p className="text-[11px] text-[#6C757D]">Set up your inventory management system</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-3 p-2 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg">
          <p className="text-[11px] text-[#721C24] flex items-center gap-1">
            <MdError className="text-[12px] flex-shrink-0" />
            <span>{error}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Row 1: Company Name (Full Width) */}
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

        {/* Row 2: Full Name & Phone (2 Columns) */}
        <div className="grid grid-cols-2 gap-3">
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

          <div>
            <label htmlFor="signup-phone" className={fieldErrors.phone ? errorLabelClass : labelClass}>
              Phone {fieldErrors.phone && '- ' + fieldErrors.phone}
            </label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength="10"
              pattern="[0-9]{10}"
              disabled={loading}
              className={`${inputClass} ${fieldErrors.phone ? 'border-[#DC3545]' : ''}`}
            />
          </div>
        </div>

        {/* Row 3: Email (Full Width) */}
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

        {/* Row 4: Address (Full Width) */}
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

        {/* Row 5: Password (Full Width) */}
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
              {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
          </div>
          {!fieldErrors.password && (
            <p className="text-[10px] text-[#6C757D] mt-0.5">Min 6 chars</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="w-full h-[40px] bg-[#1C2033] text-white font-semibold text-[13px] rounded-xl hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
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
        <p className="text-center text-[11px] text-[#6C757D]">
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

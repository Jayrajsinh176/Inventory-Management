import { MdPerson, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';

const CustomerInfo = ({ customerData, onCustomerChange, onCustomerSelect }) => {
  const inputClass =
    'w-full h-[44px] px-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200';

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2';

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6">
      <h3 className="text-[16px] font-semibold text-[#212529] mb-4">Customer Information</h3>

      {/* Tabs: New or Existing */}
      <div className="flex gap-4 mb-6 border-b border-[#DEE2E6]">
        <button
          onClick={() => onCustomerSelect('new')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors ${
            customerData.type === 'new'
              ? 'text-[#000000] border-b-2 border-[#000000]'
              : 'text-[#6C757D] hover:text-[#212529]'
          }`}
        >
          New Customer
        </button>
        <button
          onClick={() => onCustomerSelect('existing')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors ${
            customerData.type === 'existing'
              ? 'text-[#000000] border-b-2 border-[#000000]'
              : 'text-[#6C757D] hover:text-[#212529]'
          }`}
        >
          Existing Customer
        </button>
      </div>

      {/* New Customer Form */}
      {customerData.type === 'new' && (
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]">
                <MdPerson size={18} />
              </span>
              <input
                type="text"
                placeholder="Enter customer name"
                value={customerData.name || ''}
                onChange={(e) => onCustomerChange('name', e.target.value)}
                className={`pl-10 pr-4 ${inputClass}`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]">
                <MdEmail size={18} />
              </span>
              <input
                type="email"
                placeholder="customer@example.com"
                value={customerData.email || ''}
                onChange={(e) => onCustomerChange('email', e.target.value)}
                className={`pl-10 pr-4 ${inputClass}`}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] text-[16px]">
                <MdPhone size={18} />
              </span>
              <input
                type="tel"
                placeholder="10-digit phone number"
                value={customerData.phone || ''}
                onChange={(e) => {
                  const phoneOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                  onCustomerChange('phone', phoneOnly);
                }}
                maxLength="10"
                className={`pl-10 pr-4 ${inputClass}`}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Address</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[#ADB5BD] text-[16px]">
                <MdLocationOn size={18} />
              </span>
              <textarea
                placeholder="Enter customer address"
                value={customerData.address || ''}
                onChange={(e) => onCustomerChange('address', e.target.value)}
                className="w-full px-10 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200 resize-none"
                rows="3"
              />
            </div>
          </div>
        </div>
      )}

      {/* Existing Customer Selection */}
      {customerData.type === 'existing' && (
        <div>
          <label className={labelClass}>Select Customer *</label>
          <select
            value={customerData.customerId || ''}
            onChange={(e) => onCustomerChange('customerId', e.target.value)}
            className={inputClass}
          >
            <option value="">-- Choose a customer --</option>
            <option value="cust_001">John Doe - +91 9876543210</option>
            <option value="cust_002">Jane Smith - +91 9876543211</option>
            <option value="cust_003">ABC Corporation - +91 9876543212</option>
            <option value="cust_004">XYZ Trading Co. - +91 9876543213</option>
          </select>
        </div>
      )}

      {/* Notes */}
      <div className="mt-4">
        <label className={labelClass}>Order Notes (Optional)</label>
        <textarea
          placeholder="Add any special notes for this order..."
          value={customerData.notes || ''}
          onChange={(e) => onCustomerChange('notes', e.target.value)}
          className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200 resize-none"
          rows="2"
        />
      </div>
    </div>
  );
};

export default CustomerInfo;

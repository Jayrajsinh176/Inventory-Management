import { MdCheckCircle, MdEdit } from 'react-icons/md';

const OrderSummary = ({ items, subtotal, tax, gst, total, onEditClick, onConfirmClick, isConfirming, paymentMethod }) => {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#212529]">Order Summary</h3>
        {!isConfirming && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 text-[#007BFF] hover:text-[#0056b3] text-[13px] font-semibold transition-colors"
          >
            <MdEdit className="text-[16px]" />
            Edit
          </button>
        )}
      </div>

      {/* Order Items */}
      <div className="p-6 border-b border-[#DEE2E6]">
        <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-4">Order Items</h4>
        <div className="space-y-3">
          {items && items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-[#212529]">{item.name}</p>
                <p className="text-[12px] text-[#6C757D]">SKU: {item.sku} × {item.quantity}</p>
              </div>
              <p className="text-[14px] font-semibold text-[#212529]">₹{(item.price * item.quantity)?.toFixed(2) || '0.00'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="p-6 space-y-3 border-b border-[#DEE2E6]">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#6C757D]">Subtotal</span>
          <span className="text-[14px] font-semibold text-[#212529]">₹{subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#6C757D]">Tax ({tax}%)</span>
          <span className="text-[14px] font-semibold text-[#212529]">₹{gst?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Total */}
      <div className="p-6 bg-[#F8F9FA]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] font-semibold text-[#212529]">Total Amount</span>
          <span className="text-[20px] font-bold text-[#000000]">₹{total?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="text-[12px] text-[#6C757D]">
          Payment Method: <span className="font-semibold capitalize text-[#212529]">{paymentMethod}</span>
        </div>
      </div>

      {/* Confirm Button */}
      {!isConfirming && (
        <div className="p-6 bg-[#F8F9FA] border-t border-[#DEE2E6]">
          <button
            onClick={onConfirmClick}
            className="w-full h-[48px] bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
          >
            <MdCheckCircle className="text-[18px]" />
            Confirm & Process Payment
          </button>
        </div>
      )}

      {/* Processing State */}
      {isConfirming && (
        <div className="p-6 bg-[#D4EDDA] border-t border-[#C3E6CB]">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[14px] font-semibold text-[#155724]">Processing payment...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;

import { MdCreditCard, MdAttachMoney } from 'react-icons/md';

const PaymentMethod = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6">
      <h3 className="text-[16px] font-semibold text-[#212529] mb-4">Payment Method</h3>

      <div className="space-y-3">
        {/* Online Payment */}
        <div
          onClick={() => onPaymentMethodChange('online')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'online'
              ? 'border-[#000000] bg-[#F8F9FA]'
              : 'border-[#DEE2E6] hover:border-[#ADB5BD]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'online'
                  ? 'border-[#000000] bg-[#000000]'
                  : 'border-[#DEE2E6]'
              }`}
            >
              {paymentMethod === 'online' && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MdCreditCard className="text-[20px] text-[#007BFF]" />
              <div>
                <p className="text-[14px] font-semibold text-[#212529]">Online Payment</p>
                <p className="text-[12px] text-[#6C757D]">Credit Card, Debit Card, UPI, Net Banking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Payment */}
        <div
          onClick={() => onPaymentMethodChange('cash')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'cash'
              ? 'border-[#000000] bg-[#F8F9FA]'
              : 'border-[#DEE2E6] hover:border-[#ADB5BD]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash'
                  ? 'border-[#000000] bg-[#000000]'
                  : 'border-[#DEE2E6]'
              }`}
            >
              {paymentMethod === 'cash' && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MdAttachMoney className="text-[20px] text-[#28A745]" />
              <div>
                <p className="text-[14px] font-semibold text-[#212529]">Cash on Delivery</p>
                <p className="text-[12px] text-[#6C757D]">Pay when the order is ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info Box */}
      <div className="mt-6 p-4 bg-[#E7F1FF] border border-[#92CDFF] rounded-lg">
        <p className="text-[12px] text-[#004085]">
          💡 <span className="font-semibold">Tip:</span> Online payments are processed instantly. Cash payments require confirmation at delivery.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;

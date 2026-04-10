import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { GST_RATE } from '../../constants/pos';

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, subtotal, gst, total, paymentMethod } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no state
  if (!cartItems) {
    navigate('/billing');
    return null;
  }

  const handleConfirm = async () => {
    setIsProcessing(true);

    // Simulate payment processing (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    navigate('/billing/success', {
      state: {
        cartItems,
        subtotal,
        gst,
        total,
        paymentMethod,
        orderDate: new Date().toLocaleString('en-IN'),
        orderId: `ORD-${Date.now()}`,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    });
  };

  const handleBack = () => {
    navigate('/billing/payment', {
      state: { cartItems, subtotal, gst, total }
    });
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#007BFF] hover:text-[#0056b3] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Payment
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">Review Your Order</h1>
            <p className="text-[14px] text-[#6C757D]">
              Please verify your order details before confirming
            </p>
          </div>

          {/* Main Layout */}
          <div className="max-w-[1000px] space-y-6">
            {/* Invoice-like UI */}
            <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                <h2 className="text-[18px] font-semibold text-[#212529]">Order Details</h2>
              </div>

              {/* Order Items */}
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-4">
                    Items
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#DEE2E6] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]">
                      <div className="col-span-5">Product Name</div>
                      <div className="col-span-2">SKU</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-1 text-right">Qty</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>

                    {cartItems.map((item, index) => (
                      <div
                        key={item.sku}
                        className="grid grid-cols-12 gap-4 py-3 border-b border-[#E9ECEF] text-[13px]"
                      >
                        <div className="col-span-5">
                          <p className="font-medium text-[#212529]">{item.name}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[#6C757D]">{item.sku}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="font-medium text-[#212529]">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="col-span-1 text-right">
                          <p className="text-[#212529]">{item.quantity}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="font-semibold text-[#212529]">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#DEE2E6]">
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#6C757D]">Subtotal</span>
                      <span className="font-medium text-[#212529]">₹{subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-[#DEE2E6]">
                      <span className="text-[#6C757D]">GST ({GST_RATE}%)</span>
                      <span className="font-medium text-[#212529]">₹{gst?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-[#DEE2E6] text-[14px]">
                      <span className="font-semibold text-[#212529]">Total Amount</span>
                      <span className="font-bold text-[#000000]">₹{total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 p-4 bg-[#E7F1FF] border border-[#92CDFF] rounded-lg">
                  <p className="text-[12px] text-[#004085]">
                    <span className="font-semibold">Payment Method:</span> {paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                disabled={isProcessing}
                className="flex-1 h-[48px] border-2 border-[#000000] text-[#000000] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 h-[48px] bg-[#28A745] text-white rounded-lg text-[14px] font-semibold hover:bg-[#218838] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewPage;

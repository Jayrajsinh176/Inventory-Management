import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { GST_RATE } from '../../constants/pos';
import { AuthService } from '../../api';

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

    try {
      const token = AuthService.getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product: item.id,
            productName: item.name,
            productSku: item.sku,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
          subtotal,
          tax: gst,
          discount: 0,
          total,
          paymentMethod,
          paymentStatus: 'paid',
          customerName: 'Walk-in Customer',
          customerPhone: '',
          customerEmail: '',
          notes: 'Created from POS billing flow',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      const order = data.order;
      const invoice = data.invoice;

      navigate('/billing/success', {
        state: {
          cartItems,
          subtotal,
          gst,
          total,
          paymentMethod,
          orderDate: new Date(order?.createdAt || Date.now()).toLocaleString('en-IN'),
          orderId: order?.orderNumber || order?._id,
          transactionId: order?.transactionId || invoice?.transactionId || 'N/A',
        }
      });
    } catch (error) {
      toast.error(error.message || 'Failed to confirm payment');
    } finally {
      setIsProcessing(false);
    }
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
      <div className="flex-1 ml-0 lg:ml-[260px]">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#212529] hover:text-[#000000] text-[14px] font-semibold mb-4 transition-colors"
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
                <div className="mt-6 p-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg">
                  <p className="text-[12px] text-[#212529]">
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

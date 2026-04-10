import { MdCheckCircle, MdDownload, MdArrowBack } from 'react-icons/md';

const PaymentSuccess = ({ order, onDownloadInvoice, onNewOrder, onViewOrders }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 max-w-[600px] w-full shadow-lg">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#D4EDDA] border-4 border-[#28A745] mx-auto mb-4">
            <MdCheckCircle className="text-[48px] text-[#28A745]" />
          </div>
          <h1 className="text-[28px] font-bold text-[#212529] mb-2">Payment Successful!</h1>
          <p className="text-[14px] text-[#6C757D]">Your order has been confirmed and processed.</p>
        </div>

        {/* Order Details */}
        <div className="bg-[#F8F9FA] rounded-lg p-6 mb-6 space-y-4 border border-[#DEE2E6]">
          {/* Order ID */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DEE2E6]">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">Order ID</span>
            <span className="text-[14px] font-bold text-[#212529]">{order?.orderId || '#ORD-202400001'}</span>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DEE2E6]">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">Total Amount</span>
            <span className="text-[18px] font-bold text-[#000000]">₹{order?.total?.toFixed(2) || '0.00'}</span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DEE2E6]">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">Payment Method</span>
            <span className="text-[14px] font-semibold text-[#212529] capitalize">{order?.paymentMethod || 'Online'}</span>
          </div>

          {/* Transaction ID */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DEE2E6]">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">Transaction ID</span>
            <span className="text-[14px] font-mono text-[#6C757D]">{order?.transactionId || 'TXN123456789'}</span>
          </div>

          {/* Number of Items */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">Items Ordered</span>
            <span className="text-[14px] font-semibold text-[#212529]">{order?.itemsCount || order?.items?.length || 0}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">Order Items</h3>
          <div className="space-y-2">
            {order?.items && order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded">
                <div>
                  <p className="text-[13px] font-medium text-[#212529]">{item.name}</p>
                  <p className="text-[11px] text-[#6C757D]">SKU: {item.sku} × {item.quantity}</p>
                </div>
                <p className="text-[13px] font-semibold text-[#212529]">₹{(item.price * item.quantity)?.toFixed(2) || '0.00'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-[#E7F1FF] border border-[#92CDFF] rounded-lg mb-6">
          <p className="text-[12px] text-[#004085]">
            📧 A confirmation email has been sent to the customer with order details and receipt.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onDownloadInvoice}
            className="w-full h-[44px] bg-[#007BFF] text-white rounded-lg text-[14px] font-semibold hover:bg-[#0056b3] transition-colors flex items-center justify-center gap-2"
          >
            <MdDownload className="text-[18px]" />
            Download Invoice
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onNewOrder}
              className="h-[44px] bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors"
            >
              New Order
            </button>
            <button
              onClick={onViewOrders}
              className="h-[44px] border-2 border-[#000000] text-[#000000] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSearch, MdAdd } from 'react-icons/md';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import CartItems from '../components/billing/CartItems';
import CustomerInfo from '../components/billing/CustomerInfo';
import PaymentMethod from '../components/billing/PaymentMethod';
import OrderSummary from '../components/billing/OrderSummary';
import PaymentSuccess from '../components/billing/PaymentSuccess';

const BillingPage = () => {
  const navigate = useNavigate();

  // States
  const [currentStep, setCurrentStep] = useState('cart'); // cart, customer, payment, confirm, success
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Keyboard',
      sku: 'KB-001',
      category: 'Electronics',
      price: 2500,
      quantity: 1,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);

  const [customerData, setCustomerData] = useState({
    type: 'new',
    name: '',
    email: '',
    phone: '',
    address: '',
    customerId: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isConfirming, setIsConfirming] = useState(false);

  // Dummy products for search
  const dummyProducts = [
    { id: 1, name: 'Wireless Keyboard', sku: 'KB-001', category: 'Electronics', price: 2500 },
    { id: 2, name: 'USB Mouse', sku: 'MS-001', category: 'Electronics', price: 800 },
    { id: 3, name: 'HDMI Cable', sku: 'AB-001', category: 'Accessories', price: 300 },
    { id: 4, name: 'Monitor Stand', sku: 'ST-001', category: 'Accessories', price: 1500 },
    { id: 5, name: 'Webcam HD', sku: 'WC-001', category: 'Electronics', price: 3500 },
    { id: 6, name: 'USB Hub 7 Port', sku: 'HB-001', category: 'Accessories', price: 1200 },
  ];

  // Filtered products based on search
  const filteredProducts = dummyProducts.filter(
    (product) =>
      !cartItems.find((item) => item.id === product.id) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 18; // GST 18%
  const gst = (subtotal * taxRate) / 100;
  const total = subtotal + gst;

  // Cart Functions
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setSearchQuery('');
    setShowProductSearch(false);
  };

  // Customer Functions
  const handleCustomerChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerSelect = (type) => {
    setCustomerData((prev) => ({ ...prev, type }));
  };

  // Validate steps
  const isCartValid = cartItems.length > 0;
  const isCustomerValid = customerData.type === 'new'
    ? customerData.name.trim() && customerData.phone.trim()
    : customerData.customerId;

  // Navigation
  const goToCustomerStep = () => {
    if (isCartValid) {
      setCurrentStep('customer');
    } else {
      alert('Please add at least one product to cart');
    }
  };

  const goToPaymentStep = () => {
    if (isCustomerValid) {
      setCurrentStep('payment');
    } else {
      alert('Please fill in required customer information');
    }
  };

  const goToConfirmStep = () => {
    setCurrentStep('confirm');
  };

  const processPayment = async () => {
    setIsConfirming(true);

    // Simulate payment processing
    try {
      // Dummy API call - replace with actual backend/payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create dummy order
      const order = {
        orderId: `ORD-${Date.now()}`,
        items: cartItems,
        customer: customerData,
        subtotal,
        tax: taxRate,
        gst,
        total,
        paymentMethod,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      };

      // Show success screen
      setCurrentStep('success');
      setIsConfirming(false);

      // Store order for display
      localStorage.setItem('lastOrder', JSON.stringify(order));
    } catch (error) {
      alert('Payment failed. Please try again.');
      setIsConfirming(false);
    }
  };

  // After Success Actions
  const handleDownloadInvoice = () => {
    alert('Invoice download functionality coming soon!');
  };

  const handleNewOrder = () => {
    // Reset everything
    setCartItems([
      {
        id: 1,
        name: 'Wireless Keyboard',
        sku: 'KB-001',
        category: 'Electronics',
        price: 2500,
        quantity: 1,
      },
    ]);
    setCustomerData({
      type: 'new',
      name: '',
      email: '',
      phone: '',
      address: '',
      customerId: '',
      notes: '',
    });
    setPaymentMethod('online');
    setCurrentStep('cart');
  };

  const handleViewOrders = () => {
    navigate('/dashboard');
  };

  // Render based on step
  if (currentStep === 'success') {
    return (
      <div className="flex bg-[#F8F9FA] min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-[260px]">
          <Header />
          <main className="p-8">
            <PaymentSuccess
              order={JSON.parse(localStorage.getItem('lastOrder') || '{}')}
              onDownloadInvoice={handleDownloadInvoice}
              onNewOrder={handleNewOrder}
              onViewOrders={handleViewOrders}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[#007BFF] hover:text-[#0056b3] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Dashboard
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">Billing & Orders</h1>
            <p className="text-[14px] text-[#6C757D]">
              Create and manage orders with items, customer info, and payment details.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center gap-4">
            {['cart', 'customer', 'payment', 'confirm'].map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[12px] ${
                    currentStep === step
                      ? 'bg-[#000000] text-white'
                      : currentStep > ['cart', 'customer', 'payment', 'confirm'].indexOf(step)
                        ? 'bg-[#28A745] text-white'
                        : 'bg-[#E9ECEF] text-[#6C757D]'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && <div className="h-1 w-8 bg-[#E9ECEF]"></div>}
              </div>
            ))}
          </div>

          {/* Content Area - Two Column Layout */}
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Main Form */}
            <div className="col-span-2 space-y-6">
              {/* STEP 1: Cart */}
              {currentStep === 'cart' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">Cart</h2>

                    {/* Product Search */}
                    <div className="mb-6 relative">
                      <button
                        onClick={() => setShowProductSearch(!showProductSearch)}
                        className="w-full h-[44px] px-4 bg-white border border-[#DEE2E6] rounded-lg text-[14px] text-[#6C757D] hover:bg-[#F8F9FA] transition-colors flex items-center gap-2 justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <MdSearch className="text-[18px]" />
                          {showProductSearch ? 'Hide product list' : 'Scan or search for products'}
                        </span>
                        <MdAdd className="text-[18px]" />
                      </button>

                      {/* Product Search Dropdown */}
                      {showProductSearch && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#DEE2E6] rounded-lg shadow-lg z-10">
                          <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[40px] px-4 border-b border-[#DEE2E6] text-[14px] focus:outline-none"
                          />
                          <div className="max-h-[300px] overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                              filteredProducts.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => addToCart(product)}
                                  className="w-full text-left p-3 border-b border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-[13px] font-semibold text-[#212529]">{product.name}</p>
                                      <p className="text-[11px] text-[#6C757D]">SKU: {product.sku}</p>
                                    </div>
                                    <p className="text-[13px] font-bold text-[#212529]">₹{product.price}</p>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center">
                                <p className="text-[13px] text-[#6C757D]">No products found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cart Items */}
                    <CartItems
                      items={cartItems}
                      onRemoveItem={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                      onAddMoreProducts={() => setShowProductSearch(true)}
                    />
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToCustomerStep}
                    disabled={!isCartValid}
                    className="w-full h-[44px] bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Customer Info
                  </button>
                </div>
              )}

              {/* STEP 2: Customer Info */}
              {currentStep === 'customer' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">Customer Information</h2>
                    <CustomerInfo
                      customerData={customerData}
                      onCustomerChange={handleCustomerChange}
                      onCustomerSelect={handleCustomerSelect}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep('cart')}
                      className="flex-1 h-[44px] border-2 border-[#000000] text-[#000000] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goToPaymentStep}
                      disabled={!isCustomerValid}
                      className="flex-1 h-[44px] bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Method */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">Payment Method</h2>
                    <PaymentMethod
                      paymentMethod={paymentMethod}
                      onPaymentMethodChange={setPaymentMethod}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep('customer')}
                      className="flex-1 h-[44px] border-2 border-[#000000] text-[#000000] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goToConfirmStep}
                      className="flex-1 h-[44px] bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Confirm Order */}
              {currentStep === 'confirm' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">Review Your Order</h2>

                    {/* Cart Review */}
                    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 mb-4">
                      <h3 className="text-[14px] font-semibold capitalize mb-4 text-[#212529]">Order Summary</h3>
                      <CartItems
                        items={cartItems}
                        onRemoveItem={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onAddMoreProducts={() => setCurrentStep('cart')}
                      />
                    </div>

                    {/* Customer Review */}
                    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 mb-4">
                      <h3 className="text-[14px] font-semibold mb-3 text-[#212529]">Customer Details</h3>
                      <div className="space-y-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#6C757D]">Name:</span>
                          <span className="font-medium text-[#212529]">
                            {customerData.type === 'new' ? customerData.name : 'Existing Customer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6C757D]">Phone:</span>
                          <span className="font-medium text-[#212529]">
                            {customerData.phone || customerData.customerId}
                          </span>
                        </div>
                        {customerData.email && (
                          <div className="flex justify-between">
                            <span className="text-[#6C757D]">Email:</span>
                            <span className="font-medium text-[#212529]">{customerData.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Review */}
                    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6">
                      <h3 className="text-[14px] font-semibold mb-3 text-[#212529]">Payment Details</h3>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#6C757D]">Method:</span>
                        <span className="font-medium capitalize text-[#212529]">{paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="flex-1 h-[44px] border-2 border-[#000000] text-[#000000] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={processPayment}
                      disabled={isConfirming}
                      className="flex-1 h-[44px] bg-[#28A745] text-white rounded-lg text-[14px] font-semibold hover:bg-[#218838] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isConfirming ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        'Confirm & Pay'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            {(currentStep === 'payment' || currentStep === 'confirm') && (
              <div>
                <OrderSummary
                  items={cartItems}
                  subtotal={subtotal}
                  tax={taxRate}
                  gst={gst}
                  total={total}
                  paymentMethod={paymentMethod}
                  onEditClick={() => setCurrentStep('cart')}
                  onConfirmClick={processPayment}
                  isConfirming={isConfirming}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BillingPage;

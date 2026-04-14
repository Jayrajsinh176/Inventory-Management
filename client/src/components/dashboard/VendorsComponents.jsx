import { useState, useEffect } from 'react';
import { MdSearch, MdPhone, MdEmail, MdLocationOn, MdClose, MdArrowBack, MdAdd } from 'react-icons/md';
import { getVendors, getVendorById, getVendorProducts, getVendorOrders, createVendor } from '../../api';

// ============================================
// VENDORS HEADER COMPONENT
// ============================================
export const VendorsHeader = ({ onAddVendor }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#212529]">Vendors Management</h1>
        <p className="text-[#6C757D] mt-2">Manage and view all your vendors, their products, and order history</p>
      </div>
      <button
        onClick={onAddVendor}
        className="flex items-center gap-2 px-4 py-2 bg-[#0D6EFD] text-white font-semibold rounded-lg hover:bg-[#0B5ED7] transition-colors"
      >
        <MdAdd className="text-xl" />
        Add Vendor
      </button>
    </div>
  );
};

// ============================================
// VENDORS LIST COMPONENT
// ============================================
export const VendorsList = ({ refreshKey, selectedVendor, onVendorSelect, onVendorsChanged }) => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [refreshKey]);

  useEffect(() => {
    filterVendors();
  }, [searchTerm, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVendors();
      setVendors(response.data || []);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    if (!searchTerm.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(term) ||
      vendor.phone.includes(term) ||
      (vendor.email && vendor.email.toLowerCase().includes(term))
    );
    setFilteredVendors(filtered);
  };

  const handleVendorAdded = () => {
    setShowAddForm(false);
    fetchVendors(); // Refresh the vendor list
  };

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#495057]"></div>
      </div>
    );
  }

  if (selectedVendor) {
    return (
      <VendorDetailView
        vendorId={selectedVendor}
        onBack={() => onVendorSelect(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Vendor Form - Shows First When Active */}
      {showAddForm && (
        <AddVendorForm
          onClose={() => setShowAddForm(false)}
          onVendorAdded={handleVendorAdded}
        />
      )}

      {/* Header with Add Button */}
      {!showAddForm && (
        <VendorsHeader onAddVendor={() => setShowAddForm(true)} />
      )}

      {/* Search Bar - Hidden when form is showing */}
      {!showAddForm && (
        <div className="bg-white rounded-lg border border-[#DEE2E6] p-4">
        <div className="flex items-center gap-3 bg-[#F8F9FA] rounded px-4 py-2">
          <MdSearch className="text-[#6C757D] text-xl" />
          <input
            type="text"
            placeholder="Search vendor by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#212529] placeholder-[#6C757D]"
          />
        </div>
      </div>
      )}

      {/* Vendors Grid - Hidden when form is showing */}
      {!showAddForm && (
        <>
          {error ? (
            <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 text-[#721C24]">
              Error: {error}
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 text-center">
              <p className="text-[#6C757D]">No vendors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onSelect={() => onVendorSelect(vendor._id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================
// VENDOR CARD COMPONENT
// ============================================
const VendorCard = ({ vendor, onSelect }) => {
  const statusColors = {
    active: 'bg-[#D4EDDA] text-[#155724]',
    inactive: 'bg-[#E2E3E5] text-[#383D41]',
    suspended: 'bg-[#F8D7DA] text-[#721C24]',
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg border border-[#DEE2E6] p-6 hover:shadow-lg hover:border-[#0D6EFD] transition-all cursor-pointer"
    >
      {/* Vendor Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#212529]">{vendor.name}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${statusColors[vendor.status] || statusColors.inactive}`}>
            {vendor.status || 'inactive'}
          </span>
        </div>
      </div>

      {/* Vendor Details */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-[#495057]">
          <MdPhone className="text-[#6C757D]" />
          <span>{vendor.phone}</span>
        </div>
        {vendor.email && (
          <div className="flex items-center gap-2 text-[#495057]">
            <MdEmail className="text-[#6C757D]" />
            <span className="truncate">{vendor.email}</span>
          </div>
        )}
        {vendor.address && (
          <div className="flex items-start gap-2 text-[#495057]">
            <MdLocationOn className="text-[#6C757D] flex-shrink-0 mt-0.5" />
            <span className="flex-1">{vendor.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// VENDOR DETAIL VIEW COMPONENT
// ============================================
const VendorDetailView = ({ vendorId, onBack }) => {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'history'

  useEffect(() => {
    fetchVendorDetails();
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [vendorRes, productsRes, ordersRes] = await Promise.all([
        getVendorById(vendorId),
        getVendorProducts(vendorId),
        getVendorOrders(vendorId),
      ]);

      setVendor(vendorRes.data);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      setError(err.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#495057]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 text-[#721C24]">
        Error: {error}
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-[#6C757D] mb-4">Vendor not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#0D6EFD] text-white rounded hover:bg-[#0B5ED7] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-[#D4EDDA] text-[#155724]',
    inactive: 'bg-[#E2E3E5] text-[#383D41]',
    suspended: 'bg-[#F8D7DA] text-[#721C24]',
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-[#0D6EFD] hover:text-[#0B5ED7] transition-colors"
      >
        <MdArrowBack /> Back to Vendors
      </button>

      {/* Vendor Header Section */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#212529]">{vendor.name}</h1>
            <span className={`inline-block px-3 py-1 rounded text-sm font-semibold mt-3 ${statusColors[vendor.status] || statusColors.inactive}`}>
              {vendor.status || 'inactive'}
            </span>
          </div>
        </div>

        {/* Vendor Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#212529] mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MdPhone className="text-[#0D6EFD] text-xl" />
                <div>
                  <p className="text-xs text-[#6C757D]">Phone</p>
                  <p className="text-[#212529] font-semibold">{vendor.phone}</p>
                </div>
              </div>
              {vendor.email && (
                <div className="flex items-center gap-3">
                  <MdEmail className="text-[#0D6EFD] text-xl" />
                  <div>
                    <p className="text-xs text-[#6C757D]">Email</p>
                    <p className="text-[#212529] font-semibold">{vendor.email}</p>
                  </div>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-start gap-3">
                  <MdLocationOn className="text-[#0D6EFD] text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6C757D]">Address</p>
                    <p className="text-[#212529] font-semibold">{vendor.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-[#DEE2E6]">
        <div className="flex border-b border-[#DEE2E6]">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-[#0D6EFD] border-b-2 border-[#0D6EFD]'
                : 'text-[#6C757D] hover:text-[#495057]'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'text-[#0D6EFD] border-b-2 border-[#0D6EFD]'
                : 'text-[#6C757D] hover:text-[#495057]'
            }`}
          >
            Order History ({orders.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'products' ? (
            <ProductsTab products={products} />
          ) : (
            <OrderHistoryTab orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRODUCTS TAB COMPONENT
// ============================================
const ProductsTab = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">No products supplied by this vendor</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#DEE2E6]">
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Product Name</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">SKU</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Price</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b border-[#DEE2E6] hover:bg-[#F8F9FA]">
              <td className="py-3 px-4 text-[#212529]">{product.name}</td>
              <td className="py-3 px-4 text-[#6C757D]">{product.sku}</td>
              <td className="py-3 px-4 text-[#6C757D]">{product.category?.name || 'N/A'}</td>
              <td className="py-3 px-4 text-[#212529] font-semibold">₹{product.price?.toFixed(2) || 0}</td>
              <td className="py-3 px-4">
                <span className={product.stock > 0 ? 'text-[#28A745]' : 'text-[#DC3545]'}>
                  {product.stock || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// ORDER HISTORY TAB COMPONENT
// ============================================
const OrderHistoryTab = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">No order history with this vendor</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#DEE2E6]">
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Order ID</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Products</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Quantity</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Total Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const totalQty = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
            const vendorProducts = order.items?.filter(item => item.product?.vendor === order.vendorName) || [];
            const totalAmount = vendorProducts.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

            return (
              <tr key={order._id} className="border-b border-[#DEE2E6] hover:bg-[#F8F9FA]">
                <td className="py-3 px-4 text-[#212529] font-semibold">{order._id?.slice(-6)}</td>
                <td className="py-3 px-4 text-[#6C757D] max-w-xs truncate">
                  {vendorProducts.map(item => item.product?.name).join(', ') || 'N/A'}
                </td>
                <td className="py-3 px-4 text-[#212529]">{totalQty}</td>
                <td className="py-3 px-4 text-[#212529] font-semibold">₹{totalAmount.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.status === 'completed' ? 'bg-[#D4EDDA] text-[#155724]' :
                    order.status === 'pending' ? 'bg-[#FFF3CD] text-[#856404]' :
                    order.status === 'cancelled' ? 'bg-[#F8D7DA] text-[#721C24]' :
                    'bg-[#E2E3E5] text-[#383D41]'
                  }`}>
                    {order.status || 'N/A'}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#6C757D]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// ADD VENDOR FORM COMPONENT (INLINE)
// ============================================
const AddVendorForm = ({ onClose, onVendorAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError('Vendor name is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    // Phone validation - simple check
    if (!/^\d{10,}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    try {
      setLoading(true);
      const response = await createVendor(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
      
      // Close form after successful submission
      setTimeout(() => {
        onVendorAdded();
      }, 500);
    } catch (err) {
      console.error('Error creating vendor:', err);
      setError(err.message || 'Failed to create vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#212529]">Add New Vendor</h2>
        <p className="text-[#6C757D] mt-2">Fill in the vendor details below</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 text-sm text-[#721C24]">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-[#D4EDDA] border border-[#C3E6CB] rounded-lg p-4 text-sm text-[#155724]">
          Vendor created successfully!
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Vendor Name */}
          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-2">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter vendor name"
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"
              disabled={loading}
            />
          </div>

          {/* Placeholder for grid alignment */}
          <div></div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#212529] mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter vendor address"
            rows="4"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD] resize-none"
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#E9ECEF] text-[#212529] font-semibold rounded-lg hover:bg-[#DEE2E6] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0D6EFD] text-white font-semibold rounded-lg hover:bg-[#0B5ED7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Add Vendor'}
          </button>
        </div>
      </form>
    </div>
  );
};

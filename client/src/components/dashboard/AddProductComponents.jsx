import { MdEdit, MdInventory2, MdImage } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getCategories, createProduct } from '../../api';

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await createProduct(formData);
      
      if (response) {
        alert('Product created successfully!');
        // Reset form
        setFormData({
          name: '',
          sku: '',
          category: '',
          price: 0,
          stock: 0,
        });
      }
    } catch (error) {
      alert(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Section 1: Basic Information */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
        {/* Section Header */}
        <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-3">
          <MdEdit className="text-[20px] text-[#6C757D]" />
          <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#212529]">
            Basic Information
          </h3>
        </div>

        {/* Section Content */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Product Name */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Minimalist Oak Chair"
                disabled={loading}
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors disabled:opacity-50"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU-2024-001"
                disabled={loading}
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Category */}
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                Category
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#000000] transition-colors appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Inventory & Pricing */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
        {/* Section Header */}
        <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-3">
          <MdInventory2 className="text-[20px] text-[#6C757D]" />
          <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#212529]">
            Inventory & Pricing
          </h3>
        </div>

        {/* Section Content */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Price */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[14px]">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg pl-8 pr-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                disabled={loading}
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                placeholder="5"
                min="0"
                disabled={true}
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <button 
          type="button"
          disabled={loading}
          className="px-6 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <span>✓</span>
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export { AddProductForm };

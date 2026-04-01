const AddProductForm = () => {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
      {/* Form Header */}
      <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6]">
        <h2 className="text-[18px] font-semibold text-[#212529] mb-1">Basic Information</h2>
        <p className="text-[13px] text-[#6C757D]">Enter the basic details about your product</p>
      </div>

      {/* Form Content */}
      <div className="p-8">
        {/* Section 1: Basic Information */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Linear Steel Handle v4"
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                SKU Code *
              </label>
              <input
                type="text"
                placeholder="e.g. SKU-001-LSH"
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Category *
              </label>
              <select className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#000000] transition-colors appearance-none cursor-pointer">
                <option>Select a category</option>
                <option>Hardware</option>
                <option>Flooring</option>
                <option>Lighting</option>
                <option>Materials</option>
                <option>Acoustics</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Subcategory
              </label>
              <select className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#000000] transition-colors appearance-none cursor-pointer">
                <option>Select subcategory (optional)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-[14px] font-semibold text-[#212529] mb-2">
              Product Description
            </label>
            <textarea
              placeholder="Describe the product, materials, specifications, and any unique features..."
              className="w-full min-h-24 bg-white border border-[#DEE2E6] rounded-lg px-4 py-3 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors resize-vertical"
            ></textarea>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#DEE2E6] my-8"></div>

        {/* Section 2: Inventory & Pricing */}
        <div className="mb-8">
          <h3 className="text-[16px] font-semibold text-[#212529] mb-6">Inventory & Pricing</h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Stock Quantity */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
              />
            </div>

            {/* Reorder Threshold */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Reorder Threshold
              </label>
              <input
                type="number"
                placeholder="10"
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
              />
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Unit Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[14px]">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg pl-8 pr-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
                />
              </div>
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Cost Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[14px]">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg pl-8 pr-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
                />
              </div>
            </div>

            {/* Unit of Measure */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Unit of Measure
              </label>
              <select className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#000000] transition-colors appearance-none cursor-pointer">
                <option>Pieces</option>
                <option>Meters</option>
                <option>Kg</option>
                <option>Liters</option>
              </select>
            </div>

            {/* Variant */}
            <div>
              <label className="block text-[14px] font-semibold text-[#212529] mb-2">
                Variant/Size
              </label>
              <input
                type="text"
                placeholder="e.g. 120mm, Brushed Finish"
                className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#DEE2E6] my-8"></div>

        {/* Section 3: Visual Assets */}
        <div className="mb-8">
          <h3 className="text-[16px] font-semibold text-[#212529] mb-6">Product Image</h3>

          <div className="border-2 border-dashed border-[#CED4DA] rounded-lg p-8 text-center bg-[#F8F9FA] hover:bg-[#F1F3F5] hover:border-[#000000] transition-all cursor-pointer">
            <i className="material-symbols-rounded text-[32px] text-[#ADB5BD] block mb-3">
              image
            </i>
            <p className="text-[14px] font-medium text-[#212529] mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-[12px] text-[#6C757D]">
              Recommended size: 1200×1200px (PNG, JPG, WebP)
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#DEE2E6]">
          <button className="px-6 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors">
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export { AddProductForm };

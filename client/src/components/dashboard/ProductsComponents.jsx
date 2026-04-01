const ProductsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#212529] mb-2">Products</h1>
        <p className="text-[14px] text-[#6C757D]">
          Manage your architectural hardware and materials inventory.
        </p>
      </div>
      <button className="bg-[#000000] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
        <i className="material-symbols-rounded">add</i>
        Add Product
      </button>
    </div>
  );
};

const SummaryCards = () => {
  const cards = [
    { label: 'Inventory Value', value: '$124,500.00', icon: 'payments' },
    { label: 'Low Stock Alerts', value: '14', icon: 'warning' },
    { label: 'Recent Movement', value: '342', icon: 'movement' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-5 shadow-md"
        >
          <p className="text-[12px] uppercase font-semibold text-[#6C757D] tracking-wide mb-2">
            {card.label}
          </p>
          <p className="text-[20px] font-bold text-[#212529]">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

const ProductsTable = () => {
  const products = [
    {
      id: 1,
      name: 'Linear Steel Handle v4',
      material: 'Brushed Finish, 120mm',
      sku: 'SKU-001-LSH',
      category: 'Hardware',
      stock: 245,
      price: '$24.99',
      status: 'IN STOCK',
    },
    {
      id: 2,
      name: 'Matte Obsidian Tile',
      material: 'Ceramic, 600x600mm',
      sku: 'SKU-002-MOT',
      category: 'Flooring',
      stock: 18,
      price: '$45.50',
      status: 'LOW STOCK',
    },
    {
      id: 3,
      name: 'Focus Downlight Pro',
      material: 'Recessed LED, 3000K',
      sku: 'SKU-003-FDP',
      category: 'Lighting',
      stock: 0,
      price: '$120.00',
      status: 'OUT OF STOCK',
    },
    {
      id: 4,
      name: 'Master Blueprint Roll',
      material: 'A0 Translucent, 80gsm',
      sku: 'SKU-004-MBR',
      category: 'Materials',
      stock: 62,
      price: '$15.99',
      status: 'IN STOCK',
    },
    {
      id: 5,
      name: 'Nordic Oak Plank',
      material: 'Engineered Wood, 2200mm',
      sku: 'SKU-005-NOP',
      category: 'Flooring',
      stock: 8,
      price: '$89.99',
      status: 'LOW STOCK',
    },
    {
      id: 6,
      name: 'Acoustic Foam Panels',
      material: 'High-Density NRC 0.95',
      sku: 'SKU-006-AFP',
      category: 'Acoustics',
      stock: 156,
      price: '$34.00',
      status: 'IN STOCK',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN STOCK':
        return { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' };
      case 'LOW STOCK':
        return { bg: '#FFF3CD', text: '#856404', border: '#FFEEBA' };
      case 'OUT OF STOCK':
        return { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' };
      default:
        return { bg: '#F8F9FA', text: '#6C757D', border: '#DEE2E6' };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
      {/* Header Stats */}
      <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center justify-between">
        <span className="text-[14px] text-[#6C757D] font-medium">
          Showing 1–12 of 482 products
        </span>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000]"
          />
          <button className="px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] hover:bg-[#F8F9FA] transition-colors">
            <i className="material-symbols-rounded text-[18px]">filter_list</i>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Category
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Price
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const colors = getStatusColor(product.status);
              return (
                <tr
                  key={product.id}
                  className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[14px] font-semibold text-[#212529]">
                        {product.name}
                      </p>
                      <p className="text-[12px] text-[#6C757D] mt-1">{product.material}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-mono text-[#212529]">{product.sku}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] text-[#6C757D]">{product.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-semibold text-[#212529]">{product.stock}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-semibold text-[#212529]">{product.price}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.border,
                      }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-[#007BFF] hover:text-[#0056b3] transition-colors">
                        <i className="material-symbols-rounded text-[20px]">edit</i>
                      </button>
                      <button className="text-[#DC3545] hover:text-[#c82333] transition-colors">
                        <i className="material-symbols-rounded text-[20px]">delete</i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
        <span className="text-[13px] text-[#6C757D]">Showing 1–6 of 482 results</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            ← Previous
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded text-[13px] transition-colors ${
                page === 1
                  ? 'bg-[#000000] text-white'
                  : 'border border-[#DEE2E6] hover:bg-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProductsHeader, SummaryCards, ProductsTable };

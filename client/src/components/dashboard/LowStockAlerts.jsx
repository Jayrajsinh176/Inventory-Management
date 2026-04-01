const LowStockAlerts = () => {
  const products = [
    {
      id: 1,
      name: 'Brutalist Column',
      category: 'Structural',
      stock: 12,
      status: 'LOW STOCK',
    },
    {
      id: 2,
      name: 'Carrara Marble Slabs',
      category: 'Materials',
      stock: 5,
      status: 'CRITICAL',
    },
    {
      id: 3,
      name: 'Acoustic Foam Panels',
      category: 'Acoustics',
      stock: 0,
      status: 'OUT OF STOCK',
    },
    {
      id: 4,
      name: 'Nordic Oak Plank',
      category: 'Flooring',
      stock: 8,
      status: 'LOW STOCK',
    },
    {
      id: 5,
      name: 'Focus Downlight Pro',
      category: 'Lighting',
      stock: 3,
      status: 'CRITICAL',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'LOW STOCK':
        return { bg: '#FFF3CD', text: '#856404', border: '#FFEEBA' };
      case 'CRITICAL':
        return { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' };
      case 'OUT OF STOCK':
        return { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' };
      default:
        return { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DEE2E6] bg-[#F8F9FA]">
        <div className="flex items-center gap-2">
          <i className="material-symbols-rounded text-[20px] text-[#DC3545]">warning</i>
          <h3 className="text-[18px] font-semibold text-[#212529]">Low Stock Alerts</h3>
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
                Category
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Stock Level
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
            {products.map((product, index) => {
              const colors = getStatusColor(product.status);
              return (
                <tr
                  key={product.id}
                  className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                >
                  <td className="px-6 py-4 text-[14px] font-medium text-[#212529]">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6C757D]">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#212529]">
                    {product.stock}
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
                    <button className="text-[#007BFF] hover:text-[#0056b3] transition-colors">
                      <i className="material-symbols-rounded text-[20px]">edit</i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#DEE2E6] text-center">
        <button className="text-[14px] text-[#007BFF] hover:text-[#0056b3] font-semibold transition-colors">
          View All Alerts →
        </button>
      </div>
    </div>
  );
};

export default LowStockAlerts;

import { MdWarning, MdEdit } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getLowStockProducts } from '../../api';

const LowStockAlerts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        const response = await getLowStockProducts();
        const lowStockProducts = response['low-stock-products'] || [];
        
        // Map backend data to component data format
        const mappedProducts = lowStockProducts.map((product) => ({
          id: product._id || product.id,
          name: product.name,
          material: product.category?.name || 'Uncategorized',
          sku: product.sku,
          category: product.category?.name || 'N/A',
          stock: product.stock,
          threshold: product.lowStockThreshold || 5, // Default threshold
          status: product.stock === 0 ? 'OUT OF STOCK' : product.stock <= product.lowStockThreshold ? 'LOW STOCK' : 'IN STOCK',
          image: '📦',
        }));

        setProducts(mappedProducts);
        setError('');
      } catch (err) {
        console.error('Failed to fetch low stock products:', err);
        setError(err.message || 'Failed to fetch low stock products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DEE2E6] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <MdWarning className="text-[20px] text-[#DC3545]" />
            <h3 className="text-[18px] font-semibold text-[#212529]">Low Stock Alerts</h3>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-[#6C757D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md">
        <div className="px-6 py-4 border-b border-[#DEE2E6] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <MdWarning className="text-[20px] text-[#DC3545]" />
            <h3 className="text-[18px] font-semibold text-[#212529]">Low Stock Alerts</h3>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-[#DC3545]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DEE2E6] bg-[#F8F9FA]">
        <div className="flex items-center gap-2">
          <MdWarning className="text-[20px] text-[#DC3545]" />
          <h3 className="text-[18px] font-semibold text-[#212529]">Low Stock Alerts</h3>
          <span className="text-[12px] text-[#6C757D] ml-auto">{products.length} items</span>
        </div>
      </div>

      {/* Table */}
      {products.length > 0 ? (
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
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Threshold Status
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E9ECEF] rounded-lg flex items-center justify-center text-[20px]">
                          {product.image}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#212529]">{product.name}</p>
                          <p className="text-[12px] text-[#6C757D]">{product.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-mono text-[#6C757D]">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#212529]">{product.stock} Units</span>
                        {product.stock < product.threshold / 2 ? (
                          <span className="text-[12px] font-bold text-[#DC3545]">—</span>
                        ) : (
                          <span className="text-[12px] font-bold text-[#FFC107]">―</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-3 py-1 text-[11px] font-semibold rounded"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#007BFF] hover:text-[#0056b3] transition-colors">
                        <MdEdit className="text-[20px]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-[#6C757D]">No low stock items found</p>
        </div>
      )}

      {/* Footer */}
      {products.length > 0 && (
        <div className="px-6 py-4 border-t border-[#DEE2E6] text-center">
          <button className="text-[14px] text-[#007BFF] hover:text-[#0056b3] font-semibold transition-colors uppercase tracking-wider">
            View All Low Stock Items
          </button>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;

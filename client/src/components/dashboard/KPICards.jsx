import { MdInventory2, MdCategory, MdWarning, MdPayments, MdTrendingUp, MdTrendingDown, MdAttachMoney } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getProductStats, getCategories, getProducts } from '../../api';

const KPICards = () => {
  const [stats, setStats] = useState({
    totalProducts: '0',
    totalCategories: '0',
    lowStockItems: '0',
    inventoryValue: '₹0.00',
    totalRevenue: '₹0.00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [statsResponse, categoriesResponse, productsResponse] = await Promise.all([
          getProductStats(),
          getCategories(),
          getProducts({ limit: 1000 }),
        ]);

        // Extract stats from response
        const productStats = statsResponse.stats || {};
        const categories = categoriesResponse.data || [];
        const products = productsResponse.products || [];

        // Calculate total revenue
        const totalRevenue = products.reduce((sum, product) => sum + product.price * product.stock, 0);

        setStats({
          totalProducts: productStats.totalProducts?.toString() || '0',
          totalCategories: categories.length.toString(),
          lowStockItems: productStats.lowStocksAlerts?.toString() || '0',
          inventoryValue: `₹${parseFloat(productStats.inventoryValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          totalRevenue: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats({
          totalProducts: '0',
          totalCategories: '0',
          lowStockItems: '0',
          inventoryValue: '₹0.00',
          totalRevenue: '₹0.00',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      description: 'Active items in inventory',
      trend: 'neutral',
      icon: MdInventory2,
      color: '#007BFF',
    },
    {
      label: 'Total Categories',
      value: stats.totalCategories,
      description: 'Product categories',
      trend: 'neutral',
      icon: MdCategory,
      color: '#28A745',
    },
    {
      label: 'Total Revenue',
      value: stats.totalRevenue,
      description: 'Expected revenue from stock',
      trend: 'up',
      icon: MdAttachMoney,
      color: '#FFC107',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockItems,
      description: parseInt(stats.lowStockItems) > 0 ? 'Items need attention' : 'All items stocked',
      statusLabel: parseInt(stats.lowStockItems) > 0 ? 'Alert' : 'OK',
      status: parseInt(stats.lowStockItems) > 0 ? 'critical' : 'good',
      trend: 'down',
      icon: MdWarning,
      color: parseInt(stats.lowStockItems) > 0 ? '#DC3545' : '#28A745',
    },
    {
      label: 'Total Inventory Value',
      value: stats.inventoryValue,
      description: 'Current stock value',
      trend: 'up',
      icon: MdPayments,
      color: '#6610F2',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-[#E9ECEF] rounded w-3/4"></div>
              <div className="w-10 h-10 bg-[#E9ECEF] rounded-lg"></div>
            </div>
            <div className="h-8 bg-[#E9ECEF] rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-[#E9ECEF] rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md hover:shadow-lg transition-shadow duration-150"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] uppercase font-semibold text-[#6C757D] tracking-[0.08em]">
              {card.label}
            </p>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${card.color}15` }}
            >
              {card.icon && <card.icon className="text-[20px]" style={{ color: card.color }} />}
            </div>
          </div>
          
          <p className="text-[28px] font-bold text-[#212529] mb-2">{card.value}</p>
          
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#6C757D]">{card.description}</p>
            {card.statusLabel && (
              <span 
                className={`text-[10px] font-semibold px-2 py-1 rounded ${
                  card.status === 'critical' 
                    ? 'bg-[#FEE2E2] text-[#DC3545]' 
                    : 'bg-[#D1FAE5] text-[#059669]'
                }`}
              >
                {card.statusLabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;

import { MdInventory2, MdCategory, MdWarning, MdPayments, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getProductStats, getCategories } from '../../api';

const KPICards = () => {
  const [stats, setStats] = useState({
    totalProducts: '0',
    totalCategories: '0',
    lowStockItems: '0',
    inventoryValue: '₹0.00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [statsResponse, categoriesResponse] = await Promise.all([
          getProductStats(),
          getCategories(),
        ]);

        // Extract stats from response
        const productStats = statsResponse.stats || {};
        const categories = categoriesResponse.data || [];

        setStats({
          totalProducts: productStats.totalProducts?.toString() || '0',
          totalCategories: categories.length.toString(),
          lowStockItems: productStats.lowStocksAlerts?.toString() || '0',
          inventoryValue: `₹${parseFloat(productStats.inventoryValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats({
          totalProducts: '0',
          totalCategories: '0',
          lowStockItems: '0',
          inventoryValue: '₹0.00',
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
      change: '+4.2%',
      trend: 'up',
      icon: MdInventory2,
    },
    {
      label: 'Total Categories',
      value: stats.totalCategories,
      trend: 'neutral',
      icon: MdCategory,
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockItems,
      statusLabel: 'Alert',
      status: 'critical',
      trend: 'down',
      icon: MdWarning,
    },
    {
      label: 'Total Inventory Value',
      value: stats.inventoryValue,
      change: '+8.1%',
      trend: 'up',
      icon: MdPayments,
    },
  ];

  const getCardColor = (status) => {
    if (status === 'critical') return '#DC3545';
    return '#007BFF';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md animate-pulse"
          >
            <div className="h-4 bg-[#E9ECEF] rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-[#E9ECEF] rounded w-1/2 mb-6"></div>
            <div className="h-3 bg-[#E9ECEF] rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md hover:shadow-lg transition-shadow duration-150"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase font-semibold text-[#6C757D] tracking-[0.08em] mb-2">
                {card.label}
              </p>
              <p className="text-[24px] font-bold text-[#212529]">{card.value}</p>
              {card.subvalue && (
                <p className="text-[12px] text-[#6C757D] mt-1">{card.subvalue}</p>
              )}
            </div>
            {card.icon && <card.icon className="text-[24px]" style={{ color: getCardColor(card.status) }} />}
          </div>

        </div>
      ))}
    </div>
  );
};

export default KPICards;

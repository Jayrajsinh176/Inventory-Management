import { useState, useEffect } from 'react';
import { getStockMovementAnalysis, getCategoryPerformanceAnalysis, getReorderPatternsAnalysis } from '../../api';

const InventoryTrendChart = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('stock-movement');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(activeAnalysis);
  }, [activeAnalysis]);

  const fetchData = async (analysisType) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      switch (analysisType) {
        case 'category-performance':
          response = await getCategoryPerformanceAnalysis();
          break;
        case 'reorder-patterns':
          response = await getReorderPatternsAnalysis();
          break;
        case 'stock-movement':
          response = await getStockMovementAnalysis();
          break;
        default:
          response = await getStockMovementAnalysis();
      }

      console.log(`${analysisType} Response:`, response);

      if (response.success) {
        setChartData(response);
      } else {
        setError(response.message || 'Failed to fetch analysis data');
      }
    } catch (err) {
      console.error('Chart data error:', err);
      setError(err.message || 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const getTitleAndDescription = () => {
    switch (activeAnalysis) {
      case 'category-performance':
        return {
          title: 'Category Performance',
          description: 'Inventory value distribution across categories',
        };
      case 'reorder-patterns':
        return {
          title: 'Reorder Patterns',
          description: 'Frequency of product reorders over time',
        };
      case 'stock-movement':
      default:
        return {
          title: 'Stock Movement Analysis',
          description: 'Units sold and fulfillment metrics over the last 6 months',
        };
    }
  };

  const renderChart = () => {
    if (!chartData || !chartData.data) return null;

    const data = chartData.data || [];
    
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-[#6C757D]">No data available</p>
        </div>
      );
    }

    // Validate and sanitize data
    const validData = data.filter(item => {
      return item && item.month && typeof item.value === 'number' && item.value >= 0;
    });

    if (validData.length === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-[#6C757D]">Invalid data format</p>
        </div>
      );
    }

    const maxValue = Math.max(...validData.map(d => d.value), 1); // Ensure max is at least 1

    if (activeAnalysis === 'category-performance') {
      // Horizontal Bar Chart for Category Performance
      const total = validData.reduce((sum, item) => sum + item.value, 0);
      const colors = ['#007BFF', '#28A745', '#FFC107', '#6C757D', '#DC3545', '#17A2B8'];
      
      return (
        <div className="space-y-4">
          {validData.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const color = colors[index % colors.length];
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-[14px] font-medium text-[#212529]">
                      {item.category || 'Unknown'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-[#212529]">
                      {percentage.toFixed(1)}%
                    </p>
                    <p className="text-[12px] text-[#6C757D]">
                      ₹{(item.actualValue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-[#E9ECEF] rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Bar Chart for Stock Movement and Reorder Patterns
      return (
        <div className="flex items-end justify-between h-48 gap-4 px-4">
          {validData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div
                className="w-full bg-[#007BFF] rounded-t-md mb-2 transition-all duration-150 hover:bg-[#0056b3] cursor-pointer"
                style={{
                  height: `${(item.value / maxValue) * 160}px`,
                }}
                title={`${item.month}: ${item.value} ${activeAnalysis === 'reorder-patterns' ? 'orders' : 'units'}`}
              >
              </div>

              {/* Label */}
              <p className="text-[13px] font-medium text-[#6C757D]">{item.month || 'N/A'}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  const getFooterNote = () => {
    if (!chartData) return '';

    switch (activeAnalysis) {
      case 'stock-movement':
        return `Total products analyzed: ${chartData.totalProductsAnalyzed} | Total inventory value: ₹${chartData.totalInventoryValue}`;
      case 'category-performance':
        return `Total categories: ${chartData.totalCategoriesAnalyzed} | Total inventory value: ₹${chartData.totalInventoryValue}`;
      case 'reorder-patterns':
        return `Average reorder frequency: ${chartData.avgReorderFrequency}/month | Low stock items: ${chartData.currentLowStockItems}`;
      default:
        return '';
    }
  };

  const { title, description } = getTitleAndDescription();

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md mb-8">
        <div className="text-center py-8">
          <p className="text-red-500 font-semibold">Error: {error}</p>
          <button
            onClick={() => fetchData(activeAnalysis)}
            className="mt-4 px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056b3] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md mb-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-[18px] font-semibold text-[#212529] mb-1">{title}</h3>
        <p className="text-[14px] text-[#6C757D]">{description}</p>
      </div>

      {/* Analysis Toggle Buttons */}
      <div className="flex gap-3 mb-6 border-b border-[#DEE2E6] pb-4">
        <button
          onClick={() => setActiveAnalysis('stock-movement')}
          className={`px-4 py-2 text-[14px] font-semibold rounded-lg transition-all ${
            activeAnalysis === 'stock-movement'
              ? 'bg-[#007BFF] text-white border border-[#007BFF]'
              : 'bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] hover:bg-[#E9ECEF]'
          }`}
        >
          📊 Stock Movement
        </button>
        <button
          onClick={() => setActiveAnalysis('category-performance')}
          className={`px-4 py-2 text-[14px] font-semibold rounded-lg transition-all ${
            activeAnalysis === 'category-performance'
              ? 'bg-[#007BFF] text-white border border-[#007BFF]'
              : 'bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] hover:bg-[#E9ECEF]'
          }`}
        >
          💰 Category Performance
        </button>
        <button
          onClick={() => setActiveAnalysis('reorder-patterns')}
          className={`px-4 py-2 text-[14px] font-semibold rounded-lg transition-all ${
            activeAnalysis === 'reorder-patterns'
              ? 'bg-[#007BFF] text-white border border-[#007BFF]'
              : 'bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] hover:bg-[#E9ECEF]'
          }`}
        >
          🔄 Reorder Patterns
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-[#DEE2E6] border-t-[#007BFF] rounded-full"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Chart Container */}
          {renderChart()}

          {/* Legend/Note */}
          <div className="mt-6 pt-6 border-t border-[#F1F3F5] text-center">
            <p className="text-[12px] text-[#6C757D]">{getFooterNote()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryTrendChart;

import { useState } from 'react';

const InventoryTrendChart = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('stock-movement');

  // Stock Movement Analysis Data
  const stockMovementData = [
    { month: 'Jan', value: 65, label: 'Units Sold' },
    { month: 'Feb', value: 72, label: 'Units Sold' },
    { month: 'Mar', value: 58, label: 'Units Sold' },
    { month: 'Apr', value: 82, label: 'Units Sold' },
    { month: 'May', value: 75, label: 'Units Sold' },
    { month: 'Jun', value: 88, label: 'Units Sold' },
  ];

  // Category Performance Data (Pie chart representation)
  const categoryPerformanceData = [
    { category: 'Electronics', value: 35, color: '#007BFF' },
    { category: 'Apparel', value: 25, color: '#28A745' },
    { category: 'Furniture', value: 20, color: '#FFC107' },
    { category: 'Others', value: 20, color: '#6C757D' },
  ];

  // Reorder Patterns Data
  const reorderPatternsData = [
    { month: 'Jan', value: 12, label: 'Reorders' },
    { month: 'Feb', value: 15, label: 'Reorders' },
    { month: 'Mar', value: 18, label: 'Reorders' },
    { month: 'Apr', value: 14, label: 'Reorders' },
    { month: 'May', value: 19, label: 'Reorders' },
    { month: 'Jun', value: 21, label: 'Reorders' },
  ];

  const getDataForAnalysis = () => {
    switch (activeAnalysis) {
      case 'category-performance':
        return categoryPerformanceData;
      case 'reorder-patterns':
        return reorderPatternsData;
      case 'stock-movement':
      default:
        return stockMovementData;
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
    const data = getDataForAnalysis();
    const maxValue = Math.max(...data.map(d => d.value));

    if (activeAnalysis === 'category-performance') {
      // Pie Chart for Category Performance
      const total = data.reduce((sum, item) => sum + item.value, 0);
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="flex items-center justify-center gap-12">
            {/* Pie Representation */}
            <div className="flex flex-col gap-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-[14px] text-[#212529] font-medium">
                    {item.category}
                  </span>
                  <span className="text-[14px] text-[#6C757D]">
                    {((item.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Circular Chart */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const circumference = 2 * Math.PI * 45;
                  const offset = circumference * (1 - percentage / 100);
                  const previousPercentage = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0);
                  const startAngle = (previousPercentage / 100) * 360;

                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={circumference * (percentage / 100)}
                      strokeDashoffset={-(circumference * (previousPercentage / 100))}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      );
    } else {
      // Bar Chart for Stock Movement and Reorder Patterns
      return (
        <div className="flex items-end justify-between h-48 gap-4 px-4">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div
                className="w-full bg-[#007BFF] rounded-t-md mb-2 transition-all duration-150 hover:bg-[#0056b3]"
                style={{
                  height: `${(item.value / maxValue) * 160}px`,
                }}
              >
              </div>

              {/* Label */}
              <p className="text-[13px] font-medium text-[#6C757D]">{item.month}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  const { title, description } = getTitleAndDescription();

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

      {/* Chart Container */}
      {renderChart()}

      {/* Legend/Note */}
      <div className="mt-6 pt-6 border-t border-[#F1F3F5] text-center">
        <p className="text-[12px] text-[#6C757D]">
          {activeAnalysis === 'stock-movement' && 'Average fulfillment rate: 78%'}
          {activeAnalysis === 'category-performance' && 'Based on current inventory valuation'}
          {activeAnalysis === 'reorder-patterns' && 'Average reorder frequency: 15.8 times/month'}
        </p>
      </div>
    </div>
  );
};

export default InventoryTrendChart;

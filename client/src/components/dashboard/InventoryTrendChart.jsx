const InventoryTrendChart = () => {
  const data = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 82 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 88 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md mb-8">
      <div className="mb-6">
        <h3 className="text-[18px] font-semibold text-[#212529] mb-1">Inventory Trend</h3>
        <p className="text-[14px] text-[#6C757D]">
          Stock levels and fulfillment rate over the last 6 months
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex items-end justify-between h-48 gap-4 px-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            {/* Bar */}
            <div className="w-full bg-[#007BFF] rounded-t-md mb-2 transition-all duration-150 hover:bg-[#0056b3]"
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

      {/* Legend/Note */}
      <div className="mt-6 pt-6 border-t border-[#F1F3F5] text-center">
        <p className="text-[12px] text-[#6C757D]">Average stock fulfillment rate: 78%</p>
      </div>
    </div>
  );
};

export default InventoryTrendChart;

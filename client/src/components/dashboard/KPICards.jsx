const KPICards = () => {
  const cards = [
    {
      label: 'Total Products',
      value: '1,234',
      change: '+12',
      trend: 'up',
      icon: 'inventory_2',
    },
    {
      label: 'Total Stock Value',
      value: '$45,320',
      change: '+8.5%',
      trend: 'up',
      icon: 'trending_up',
    },
    {
      label: 'Low Stock Items',
      value: '28',
      change: '+5',
      trend: 'down',
      icon: 'warning',
    },
    {
      label: 'Recent Movement',
      value: '342',
      change: '+23%',
      trend: 'up',
      icon: 'movement',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md hover:shadow-lg transition-shadow duration-150"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[12px] uppercase font-semibold text-[#6C757D] tracking-wide mb-2">
                {card.label}
              </p>
              <p className="text-[24px] font-bold text-[#212529]">{card.value}</p>
            </div>
            <i className="material-symbols-rounded text-[24px] text-[#007BFF]">
              {card.icon}
            </i>
          </div>

          {/* Change indicator */}
          <div className="flex items-center gap-2">
            <i className={`material-symbols-rounded text-[16px] ${
              card.trend === 'up' ? 'text-[#28A745]' : 'text-[#DC3545]'
            }`}>
              {card.trend === 'up' ? 'trending_up' : 'trending_down'}
            </i>
            <span className={`text-[14px] font-semibold ${
              card.trend === 'up' ? 'text-[#28A745]' : 'text-[#DC3545]'
            }`}>
              {card.change}
            </span>
            <span className="text-[14px] text-[#6C757D]">
              {card.trend === 'up' ? 'vs last month' : 'vs last month'}
            </span>
          </div>

          {/* Left border accent */}
          <div className="absolute left-0 top-0 h-full w-1 bg-[#000000] rounded-l-lg opacity-0 hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;

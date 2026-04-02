import { MdInventory2, MdCategory, MdWarning, MdPayments, MdTrendingUp, MdTrendingDown } from 'react-icons/md';

const KPICards = () => {
  const cards = [
    {
      label: 'Total Products',
      value: '2,450',
      change: '+4.2%',
      trend: 'up',
      icon: MdInventory2,
    },
    {
      label: 'Total Categories',
      value: '18',
      subvalue: 'Active Segments',
      trend: 'neutral',
      icon: MdCategory,
    },
    {
      label: 'Low Stock Items',
      value: '12',
      statusLabel: 'Critical',
      status: 'critical',
      trend: 'down',
      icon: MdWarning,
    },
    {
      label: 'Total Inventory Value',
      value: '$1.24M',
      change: '+8.1%',
      trend: 'up',
      icon: MdPayments,
    },
  ];

  const getCardColor = (status) => {
    if (status === 'critical') return '#DC3545';
    return '#007BFF';
  };

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

          {/* Status Badge or Change Indicator */}
          <div className="flex items-center gap-2">
            {card.statusLabel ? (
              <span className="inline-block px-2.5 py-1 bg-[#DC3545] text-white text-[10px] font-semibold rounded">
                {card.statusLabel}
              </span>
            ) : (
              <>
                {card.trend === 'up' ? (
                  <MdTrendingUp className={`text-[14px] text-[#28A745]`} />
                ) : card.trend === 'down' ? (
                  <MdTrendingDown className={`text-[14px] text-[#DC3545]`} />
                ) : (
                  <span className={`text-[14px] text-[#6C757D]`}>−</span>
                )}
                <span className={`text-[12px] font-semibold ${
                  card.trend === 'up' ? 'text-[#28A745]' : card.trend === 'down' ? 'text-[#DC3545]' : 'text-[#6C757D]'
                }`}>
                  {card.change}
                </span>
                <span className="text-[12px] text-[#6C757D]">vs last month</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;

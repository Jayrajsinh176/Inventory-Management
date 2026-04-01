const CategoriesHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#212529] mb-2">Categories</h1>
        <p className="text-[14px] text-[#6C757D]">Manage product classification</p>
      </div>
      <button className="bg-[#000000] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
        <i className="material-symbols-rounded">add</i>
        Add Category
      </button>
    </div>
  );
};

const CategoriesGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      icon: 'bolt',
      count: 45,
      color: '#007BFF',
    },
    {
      id: 2,
      name: 'HVAC Systems',
      icon: 'air',
      count: 28,
      color: '#17A2B8',
    },
    {
      id: 3,
      name: 'Lab Equipment',
      icon: 'science',
      count: 36,
      color: '#6C757D',
    },
    {
      id: 4,
      name: 'Structural Materials',
      icon: 'category',
      count: 62,
      color: '#28A745',
    },
    {
      id: 5,
      name: 'Surfacing & Flooring',
      icon: 'tile',
      count: 54,
      color: '#FFC107',
    },
    {
      id: 6,
      name: 'Acoustics',
      icon: 'sound_detection_loud_sound',
      count: 19,
      color: '#DC3545',
    },
    {
      id: 7,
      name: 'Lighting',
      icon: 'light',
      count: 41,
      color: '#FFD700',
    },
    {
      id: 8,
      name: 'Hardware',
      icon: 'hardware',
      count: 73,
      color: '#8B4513',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md hover:shadow-lg hover:border-[#000000] transition-all duration-150 group cursor-pointer"
        >
          {/* Icon and Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <i
                className="material-symbols-rounded text-[24px]"
                style={{ color: category.color }}
              >
                {category.icon}
              </i>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="material-symbols-rounded text-[20px] text-[#6C757D]">
                more_vert
              </i>
            </button>
          </div>

          {/* Category Name */}
          <h3 className="text-[16px] font-semibold text-[#212529] mb-1">
            {category.name}
          </h3>

          {/* Product Count */}
          <p className="text-[13px] text-[#6C757D] mb-4">
            {category.count} products
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex-1 px-3 py-2 border border-[#DEE2E6] rounded-md text-[12px] hover:bg-[#F8F9FA] transition-colors flex items-center justify-center gap-1">
              <i className="material-symbols-rounded text-[16px]">edit</i>
              Edit
            </button>
            <button className="flex-1 px-3 py-2 bg-[#F8F9FA] border border-[#DEE2E6] rounded-md text-[12px] hover:bg-[#E9ECEF] transition-colors flex items-center justify-center gap-1">
              <i className="material-symbols-rounded text-[16px]">delete</i>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { CategoriesHeader, CategoriesGrid };

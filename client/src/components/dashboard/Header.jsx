import { MdSearch, MdNotifications } from 'react-icons/md';

const Header = () => {
  return (
    <div className="h-14 bg-white border-b border-[#DEE2E6] sticky top-0 z-10 flex items-center justify-between px-8">
      {/* Search Input */}
      <div className="w-72 relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[20px]" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-10 bg-[#F8F9FA] border border-[#DEE2E6] rounded-md pl-10 pr-4 text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] focus:bg-[#F8F9FA] transition-all duration-150"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-[#6C757D] hover:text-[#212529] transition-colors">
          <MdNotifications className="text-[20px]" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#DC3545] rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-[#007BFF] rounded-full flex items-center justify-center text-white text-[12px] font-bold border-2 border-[#DEE2E6]">
          JA
        </div>
      </div>
    </div>
  );
};

export default Header;

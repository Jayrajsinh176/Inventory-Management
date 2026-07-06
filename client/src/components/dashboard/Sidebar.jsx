import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../api';
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdGroup,
  MdPayments,
  MdSettings,
  MdLogout,
  MdNotifications,
  MdPerson,
  MdFactCheck,
  MdBusiness,
  MdReceiptLong,
  MdStore,
  MdExpandMore,
  MdChevronRight,
} from 'react-icons/md';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getUser();
  const company = AuthService.getCompany();
  console.log(user);
  console.log(company);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [franchiseOpen, setFranchiseOpen] = useState(true);
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsMobileOpen((isOpen) => !isOpen);
    };

    const handleCloseSidebar = () => {
      setIsMobileOpen(false);
    };

    window.addEventListener('toggle-dashboard-sidebar', handleToggleSidebar);
    window.addEventListener('close-dashboard-sidebar', handleCloseSidebar);

    return () => {
      window.removeEventListener('toggle-dashboard-sidebar', handleToggleSidebar);
      window.removeEventListener('close-dashboard-sidebar', handleCloseSidebar);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    document.body.style.overflow = '';
  }, [isMobileOpen]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navigateTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    AuthService.clearAuth();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <div className={`w-[260px] h-[100dvh] bg-[#F1F3F5] border-r border-[#DEE2E6] fixed left-0 top-0 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Area */}
        <div className="px-4 py-4 border-b border-[#DEE2E6]">
          <h1 className="text-[15.5px] font-bold text-[#212529]">SILENT ARCHITECT</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          <NavItem
            icon="dashboard"
            label="Dashboard"
            path="/dashboard"
            active={isActive('/dashboard')}
            onClick={() => navigateTo('/dashboard')}
          />
          <NavItem
            icon="business"
            label="Vendors"
            path="/vendors"
            active={isActive('/vendors')}
            onClick={() => navigateTo('/vendors')}
          />
          <NavItem
            icon="category"
            label="Categories"
            path="/categories"
            active={isActive('/categories')}
            onClick={() => navigateTo('/categories')}
          />
          <NavItem
            icon="inventory_2"
            label="Products"
            path="/products"
            active={isActive('/products') || isActive('/products/add')}
            onClick={() => navigateTo('/products')}
          />
          <NavItem
            icon="group"
            label="Users"
            path="/users"
            active={isActive('/users')}
            onClick={() => navigateTo('/users')}
          />
          <NavItem
            icon="payments"
            label="Subscription"
            path="/subscription"
            active={isActive('/subscription')}
            onClick={() => navigateTo('/subscription')}
          />
          <NavItem
            icon="fact_check"
            label="Billing"
            path="/billing"
            active={isActive('/billing')}
            onClick={() => navigateTo('/billing')}
          />

          <NavItem
            icon="receipt"
            label="Billing History"
            path="/billing-history"
            active={isActive('/billing-history')}
            onClick={() => navigateTo('/billing-history')}
          />
{company?.plan === "Business" && (
          <div className="space-y-1">
            <button
              onClick={() => setFranchiseOpen(!franchiseOpen)}
              className="w-full h-11 flex items-center justify-between px-3 rounded-md text-[#6C757D] font-medium hover:bg-[#E9ECEF]"
            >
              <div className="flex items-center gap-3">
                <MdStore className="text-[18px]" />
                <span className="text-[14px]">Franchises</span>
              </div>

              {franchiseOpen ? (
                <MdExpandMore className="text-[18px]" />
              ) : (
                <MdChevronRight className="text-[18px]" />
              )}
            </button>

            {franchiseOpen && (
              <div className="ml-8 space-y-1">
                <button
                  onClick={() => navigateTo("/franchises/add")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${isActive("/franchises/add")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                >
                  Add Franchise
                </button>

                <button
                  onClick={() => navigateTo("/franchises")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${isActive("/franchises")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                >
                  Franchise List
                </button>

                {/* <button
                  onClick={() => navigateTo("/franchises/performance")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${isActive("/franchises/performance")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                >
                  Franchise Performance
                </button> */}
              </div>
            )}
          </div>
)}
          {/* Divider */}
          <div className="border-t border-[#DEE2E6] my-3"></div>

          <NavItem
            icon="notifications"
            label="Notifications"
            path="/notifications"
            active={isActive('/notifications')}
            onClick={() => navigateTo('/notifications')}
          />
          <NavItem
            icon="person"
            label="My Profile"
            path="/profile"
            active={isActive('/profile')}
            onClick={() => navigateTo('/profile')}
          />
        </nav>

        {/* User Info + Logout (bottom) */}
        <div className="px-4 py-4 border-t border-[#DEE2E6] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#000000] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#212529] truncate">{user?.name || 'User'}</p>
              <p className="text-[12px] text-[#6C757D] truncate capitalize">{user?.role || 'staff'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#6C757D] font-medium hover:bg-[#E9ECEF] hover:text-[#212529] transition-colors"
          >
            <MdLogout className="text-[18px]" />
            <span className="text-[13px]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick, path }) => {
  const iconMap = {
    dashboard: MdDashboard,
    inventory_2: MdInventory2,
    category: MdCategory,
    business: MdBusiness,
    group: MdGroup,
    payments: MdPayments,
    settings: MdSettings,
    notifications: MdNotifications,
    person: MdPerson,
    fact_check: MdFactCheck,
    receipt: MdReceiptLong,
    store: MdStore,
  };

  const IconComponent = iconMap[icon];

  return (
    <button
      onClick={onClick}
      className={`w-full h-11 flex items-center gap-3 px-3 rounded-md transition-all duration-150 ${active
          ? 'bg-[#E9ECEF] text-[#000000] font-semibold border-l-3 border-[#000000] pl-2'
          : 'text-[#6C757D] font-medium hover:bg-[#E9ECEF]'
        }`}
    >
      {IconComponent && <IconComponent className="text-[18px]" />}
      <span className="text-[14px]">{label}</span>
    </button>
  );
};

export default Sidebar;

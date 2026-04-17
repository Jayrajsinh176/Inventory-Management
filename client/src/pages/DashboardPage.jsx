import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import toast from 'react-hot-toast';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import KPICards from '../components/dashboard/KPICards';
import InventoryTrendChart from '../components/dashboard/InventoryTrendChart';
import InventoryHealthFeed from '../components/dashboard/InventoryHealthFeed';
import LowStockAlerts from '../components/dashboard/LowStockAlerts';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleExportReport = () => {
    // For now, show a toast. In production, this would generate a PDF/CSV
    toast('Export functionality coming soon! This will generate a PDF/CSV report of your inventory data.');
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[260px]">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529] mb-2">
                Inventory Overview
              </h1>
              <p className="text-[14px] text-[#6C757D]">
                Real-time status of your global architecture warehouse.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportReport}
                className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors"
              >
                Export Report
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <KPICards />

          {/* Inventory Trend Chart */}
          <InventoryTrendChart />

          {/* Inventory Health Feed */}
          {/* <InventoryHealthFeed /> */}

          {/* Low Stock Alerts Table */}
          <LowStockAlerts />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

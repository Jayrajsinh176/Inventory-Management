import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import KPICards from '../components/dashboard/KPICards';
import InventoryTrendChart from '../components/dashboard/InventoryTrendChart';
import InventoryHealthFeed from '../components/dashboard/InventoryHealthFeed';
import LowStockAlerts from '../components/dashboard/LowStockAlerts';

const DashboardPage = () => {
  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-[#212529] mb-2">
              Inventory Overview
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              Real-time status of your global architecture warehouse.
            </p>
          </div>

          {/* KPI Cards */}
          <KPICards />

          {/* Inventory Trend Chart */}
          <InventoryTrendChart />

          {/* Inventory Health Feed */}
          <InventoryHealthFeed />

          {/* Low Stock Alerts Table */}
          <LowStockAlerts />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

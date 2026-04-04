import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { ProductsHeader, SummaryCards, ProductsTable } from '../components/dashboard/ProductsComponents';

const ProductsPage = () => {
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
          {/* Products Header */}
          <ProductsHeader />

          {/* Summary Cards */}
          <SummaryCards />

          {/* Products Table */}
          <ProductsTable />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;

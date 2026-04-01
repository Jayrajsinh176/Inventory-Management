import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { AddProductForm } from '../components/dashboard/AddProductComponents';

const AddProductPage = () => {
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
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-[24px] font-bold text-[#212529]">Add New Product</h1>
                <p className="text-[14px] text-[#6C757D] mt-2">
                  Create a new entry in your architectural furniture catalog.
                </p>
              </div>
            </div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[13px] text-[#6C757D] mt-4">
              <span>Products</span>
              <i className="material-symbols-rounded text-[16px]">chevron_right</i>
              <span className="text-[#212529] font-medium">Add New</span>
            </div>
          </div>

          {/* Form */}
          <AddProductForm />
        </main>
      </div>
    </div>
  );
};

export default AddProductPage;

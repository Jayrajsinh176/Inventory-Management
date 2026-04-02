import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { UsersHeader, UsersTable } from '../components/dashboard/UsersComponents';

const UsersPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

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
          {/* Users Header */}
          <UsersHeader 
            onAddClick={() => setShowAddForm(!showAddForm)} 
            loading={false}
          />

          {/* Users Table */}
          <UsersTable />
        </main>
      </div>
    </div>
  );
};

export default UsersPage;

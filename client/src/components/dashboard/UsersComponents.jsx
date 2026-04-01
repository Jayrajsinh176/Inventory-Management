const UsersHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#212529] mb-2">Users</h1>
        <p className="text-[14px] text-[#6C757D]">Manage your team members and roles</p>
      </div>
      <button className="bg-[#000000] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
        <i className="material-symbols-rounded">add</i>
        Add Team Member
      </button>
    </div>
  );
};

const UsersTable = () => {
  const users = [
    {
      id: 1,
      name: 'Elena Vance',
      userId: 'ARCH-4022',
      email: 'elena.vance@example.com',
      role: 'ADMIN',
      status: 'active',
      avatar: 'EV',
    },
    {
      id: 2,
      name: 'Julian Aris',
      userId: 'ARCH-9921',
      email: 'julian.aris@example.com',
      role: 'STAFF',
      status: 'active',
      avatar: 'JA',
    },
    {
      id: 3,
      name: 'Sarah Moat',
      userId: 'ARCH-1155',
      email: 'sarah.moat@example.com',
      role: 'STAFF',
      status: 'active',
      avatar: 'SM',
    },
    {
      id: 4,
      name: 'Rachel Thorne',
      userId: 'ARCH-7782',
      email: 'rachel.thorne@example.com',
      role: 'ADMIN',
      status: 'inactive',
      avatar: 'RT',
    },
    {
      id: 5,
      name: 'Marcus Johnson',
      userId: 'ARCH-5543',
      email: 'marcus.johnson@example.com',
      role: 'STAFF',
      status: 'active',
      avatar: 'MJ',
    },
    {
      id: 6,
      name: 'Diana Chen',
      userId: 'ARCH-3366',
      email: 'diana.chen@example.com',
      role: 'STAFF',
      status: 'active',
      avatar: 'DC',
    },
  ];

  const getRoleBadge = (role) => {
    if (role === 'ADMIN') {
      return {
        bg: '#000000',
        text: '#FFFFFF',
        border: 'none',
      };
    }
    return {
      bg: '#E7F1FF',
      text: '#004085',
      border: '1px solid #B8DAFF',
    };
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#28A745' : '#6C757D';
  };

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6]">
        <span className="text-[14px] text-[#6C757D] font-medium">
          Showing 1–10 of 42 team members
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                ID
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Email
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Role
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const statusColor = getStatusColor(user.status);

              return (
                <tr
                  key={user.id}
                  className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                >
                  {/* Name with Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                        {user.avatar}
                      </div>
                      <p className="text-[14px] font-semibold text-[#212529]">{user.name}</p>
                    </div>
                  </td>

                  {/* User ID */}
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-mono text-[#6C757D]">{user.userId}</p>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <p className="text-[14px] text-[#6C757D]">{user.email}</p>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border"
                      style={{
                        backgroundColor: roleBadge.bg,
                        color: roleBadge.text,
                        borderColor: roleBadge.border,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: statusColor }}
                      ></div>
                      <span className="text-[13px] text-[#6C757D] capitalize">
                        {user.status}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-[#007BFF] hover:text-[#0056b3] transition-colors">
                        <i className="material-symbols-rounded text-[20px]">edit</i>
                      </button>
                      <button className="text-[#DC3545] hover:text-[#c82333] transition-colors">
                        <i className="material-symbols-rounded text-[20px]">delete</i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
        <span className="text-[13px] text-[#6C757D]">Showing 1–6 of 42 results</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            ← Previous
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded text-[13px] transition-colors ${
                page === 1
                  ? 'bg-[#000000] text-white'
                  : 'border border-[#DEE2E6] hover:bg-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export { UsersHeader, UsersTable };

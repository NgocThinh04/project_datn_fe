// src/components/layout/Sidebar.tsx
import { Home, Workflow, FileText, Users, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menu = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/workflows', icon: Workflow, label: 'Quản lý Workflow' },
    { path: '#', icon: FileText, label: 'Yêu cầu' },
    { path: '#', icon: Users, label: 'Người dùng' },
    { path: '#', icon: Settings, label: 'Cài đặt hệ thống' },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Quản Trị Viên</h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={22} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
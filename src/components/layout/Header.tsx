// src/components/layout/Header.tsx
import { Bell, LogOut} from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-600">Phê Duyệt</h1>
        <span className="text-sm text-gray-500">Company Admin</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-3 hover:bg-gray-100 rounded-xl transition">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-gray-800">Nguyễn Ngọc</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            NN
          </div>
        </div>

        {/* Logout */}
        <button className="p-3 hover:bg-gray-100 rounded-xl text-red-600 transition">
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
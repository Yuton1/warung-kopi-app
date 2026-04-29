import React from 'react';
import { 
  LayoutDashboard, Users, Coffee, 
  ClipboardList, PieChart, Settings, LogOut, Ticket
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, writeStoredValue } from '../../data/customerStorage';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    writeStoredValue(STORAGE_KEYS.auth, null);
    window.dispatchEvent(new Event('warungkopi-state-changed'));
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-[#2c1b0e] h-screen sticky top-0 flex flex-col p-6 text-white shadow-2xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="h-8 w-8 bg-[#e39b4f] rounded-lg rotate-12 flex items-center justify-center shadow-lg">
          <Coffee size={20} className="text-[#2c1b0e] -rotate-12" />
        </div>
        <span className="text-xl font-black tracking-tighter">WARUNGKOPI</span>
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 px-2">
          Main Management
        </p>
        
        {/* Menu Khusus Admin */}
        {role === 'admin' && (
          <>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/admin" />
            <SidebarItem icon={Users} label="User Management" path="/admin/users" />
            <SidebarItem icon={Coffee} label="Menu Management" path="/admin/menu" />
            <SidebarItem icon={Ticket} label="Loyalty Rewards" path="/admin/rewards" />
            <SidebarItem icon={PieChart} label="Sales Reports" path="/admin/reports" />
          </>
        )}

        {/* Menu Khusus Barista */}
        {role === 'barista' && (
          <>
            <SidebarItem icon={ClipboardList} label="Order Queue" path="/barista" />
            <SidebarItem icon={Coffee} label="Inventory" path="/barista/inventory" />
            <SidebarItem icon={PieChart} label="Daily Report" path="/barista/report" />
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-[#3d2b1d]">
        <SidebarItem icon={Settings} label="Settings" path="/settings" />
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout Account</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
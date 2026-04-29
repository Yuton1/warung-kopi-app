import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-[#e39b4f] text-white shadow-lg shadow-orange-900/20' 
          : 'text-gray-400 hover:bg-[#3d2b1d] hover:text-white'
      }`}
    >
      <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-[#e39b4f]'}`} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default SidebarItem;
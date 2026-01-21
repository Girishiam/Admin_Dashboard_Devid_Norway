import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  UserGroupIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { 
      id: 1, 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: ChartBarIcon 
    },
    { 
      id: 2, 
      name: 'User Management', 
      path: '/users', 
      icon: UsersIcon 
    },
    { 
      id: 3, 
      name: 'Administrators', 
      path: '/administrators', 
      icon: UserGroupIcon 
    },
    { 
      id: 4, 
      name: 'Sessions', 
      path: '/sessions', 
      icon: CogIcon 
    },

    { 
      id: 6, 
      name: 'Payment', 
      path: '/payment', 
      icon: CogIcon 
    },
  ];

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <img 
          src="/main-logo.png" 
          alt="Logo" 
          className="w-16 h-16 mx-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#006699] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

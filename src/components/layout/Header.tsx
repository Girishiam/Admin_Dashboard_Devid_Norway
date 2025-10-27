import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="bg-white h-16 fixed top-0 right-0 left-64 shadow-sm z-10 flex items-center justify-end px-6">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=006699&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
          </div>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

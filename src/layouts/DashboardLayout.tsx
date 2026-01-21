import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import AccountSettingsModal from '../modals/AccountSettingsModal';
import PasswordChangeModal from '../modals/PasswordChangeModal';

// Menu items
const menuItems = [
  { path: '/dashboard', icon: '/icons/dashboard_icon.png', label: 'Dashboard' },
  { path: '/users', icon: '/icons/user_icon.png', label: 'User Management' },
  { path: '/administrators', icon: '/icons/admin_icon.png', label: 'Administrators' },
  { path: '/sessions', icon: '/icons/session_icon.png', label: 'Sessions' },
  { path: '/payment', icon: '/icons/payment_icon.png', label: 'Payment' },

];

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-[#E6F0F5]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-[240px] bg-white flex flex-col border-r border-gray-200 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-6 flex items-center justify-center relative">
          <Link to="/dashboard" className="flex items-center justify-center w-full">
            <img 
              src="/main-logo.png" 
              alt="Logo" 
              style={{
                width: '104px',
                height: '104px',
                opacity: 1,
                transform: 'rotate(0deg)',
              }}
              className="object-contain"
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg transition-colors absolute right-4 top-1/2 -translate-y-1/2"
            style={{ backgroundColor: '#006699' }}
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 pt-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="relative">
                  {isActive && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full"
                      style={{ backgroundColor: '#006699' }}
                    />
                  )}
                  
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 ml-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#006699] text-white rounded-xl font-semibold' 
                        : 'text-gray-800 hover:bg-gray-100 rounded-lg font-medium'
                    }`}
                    style={{
                      fontSize: '14px',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {/* Icon */}
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? 'brightness-0 invert' : 'opacity-70'}`}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer Links */}
        <div className="px-6 py-4 mt-auto text-xs text-gray-700 border-t border-gray-100" style={{ fontSize: '11px' }}>
        <div className="flex items-center gap-2 flex-nowrap">
            <Link to="/privacy-policy" className="hover:text-gray-900 transition-colors whitespace-nowrap">
            Privacy & Policy
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/terms-conditions" className="hover:text-gray-900 transition-colors whitespace-nowrap">
            Terms & Conditions
            </Link>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">
        {/* Header */}
        <header className="bg-white px-4 sm:px-6 md:px-8 py-3 flex justify-between lg:justify-end items-center border-b border-gray-200 z-30 sticky top-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-white border border-gray-200 rounded-xl flex items-center px-3 md:px-4 py-2 gap-2 md:gap-3 shadow-sm hover:border-gray-300 transition-all"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=006699&color=fff&rounded=true&size=60`}
                alt="User"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
              />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="font-bold text-gray-900 text-[13px] md:text-[14px]">{user?.username || 'Moni Roy'}</span>
                <span className="text-gray-500 text-[11px] md:text-[12px] font-medium">{user?.role || 'Super Admin'}</span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] overflow-hidden">
                {/* User Info Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=006699&color=fff&rounded=true&size=80`}
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{user?.username || 'Moni Roy'}</p>
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mt-1"
                        style={{ backgroundColor: '#006699' }}
                      >
                        {user?.role || 'Super Admin'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => { setShowAccountModal(true); setShowDropdown(false); }}
                    className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-gray-800 text-sm transition-colors font-medium group"
                  >
                    <span>Profile</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => { setShowPasswordModal(true); setShowDropdown(false); }}
                    className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-gray-800 text-sm transition-colors font-medium group"
                  >
                    <span>Change Password</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="px-4 py-3">
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#006699' }}
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="relative flex-1 min-h-0 p-4 sm:p-5 md:p-6 lg:p-8 bg-[#E6F0F5] overflow-auto">
          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modals */}
      <AccountSettingsModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)}
        onOpenPasswordModal={() => {
          setShowAccountModal(false);
          setShowPasswordModal(true);
        }}
      />
      <PasswordChangeModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}

export default DashboardLayout;

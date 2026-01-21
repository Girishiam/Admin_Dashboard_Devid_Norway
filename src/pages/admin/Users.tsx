import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../api_integration';

interface User {
  id: string;
  name: string;
  email: string;
  userEmail: string;
  subscription: string;
  phone: string;
  avatar: string;
  isDisabled?: boolean;
}



// Main User Management Component
function Users() {
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'subscribers'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        let url = `${BASE_URL}admin/users?page=${currentPage}`;
        
        // Add filtering params
        if (activeTab === 'free') {
          url += '&subscription=Free';
        } else if (activeTab === 'subscribers') {
          // Changed to 'Subscriber' to match common API patterns for non-free users
          url += '&subscription=Subscriber'; 
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        
        // Map API data to User interface
        // API returns: { users: [...], pagination: {...} }
        if (data.users) {
          let mappedUsers = data.users.map((u: any) => ({
            id: `#${u.id}`,
            name: u.username || 'Unknown',
            email: u.email || '',
            userEmail: u.email || '', // Duplicate as per UI requirement
            subscription: u.subscription || 'Free',
            phone: 'N/A', // Not provided by API
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || 'User')}&background=006699&color=fff`,
            isDisabled: false // Not provided by API, default to false
          }));

          // Client-side fallback: Filter out free users if in subscribers tab
          // This handles the case where the API ignores the subscription filter
          if (activeTab === 'subscribers') {
            mappedUsers = mappedUsers.filter((u: any) => u.subscription !== 'Free');
          }

          setUsers(mappedUsers);
        }

        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
        }

      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
        // Fallback or empty state could be handled here
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, activeTab]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleTabChange = (tab: 'all' | 'free' | 'subscribers') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };



  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Tabs */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'all' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={activeTab === 'all' ? { backgroundColor: '#006699' } : {}}
            >
              All
            </button>
            <button
              onClick={() => handleTabChange('free')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'free' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={activeTab === 'free' ? { backgroundColor: '#006699' } : {}}
            >
              Free
            </button>
            <button
              onClick={() => handleTabChange('subscribers')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'subscribers' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={activeTab === 'subscribers' ? { backgroundColor: '#006699' } : {}}
            >
              Subscribers
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">SL no.</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Subscription</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                    {error} <br/>
                    {/* Retry button/logic could be added here if fetchUsers was extracted or accessible */}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                     No users found.
                   </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors ${user.isDisabled ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            {user.name}
                            {user.isDisabled && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">Disabled</span>}
                          </div>
                          <div className="text-xs text-gray-500">{user.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{user.subscription}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {users.map((user, index) => (
            <div key={index} className={`p-4 hover:bg-gray-50 transition-colors ${user.isDisabled ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{user.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        user.subscription === 'Free' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {user.subscription}
                      </span>
                      {user.isDisabled && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">Disabled</span>}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{user.name}</div>
                    <div className="text-xs text-gray-600 mb-0.5 truncate">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`min-w-[32px] px-2 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    page === currentPage ? 'text-white shadow-md' 
                    : page === '...' ? 'bg-transparent text-gray-400 cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  style={page === currentPage ? { backgroundColor: '#006699', borderColor: '#006699' } : {}}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Users;

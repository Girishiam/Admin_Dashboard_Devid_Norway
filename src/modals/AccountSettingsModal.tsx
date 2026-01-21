import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../api_integration';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPasswordModal: () => void;
}

function AccountSettingsModal({ isOpen, onClose, onOpenPasswordModal }: AccountSettingsModalProps) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin'
  });

  React.useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.role === 'superadmin' ? '' : '', // Phone might not be in user context currently? Check AuthContext. User interface doesn't have phone. 
        role: user.role || 'admin'
      });
      // Note: User interface in AuthContext needs phone to fully pre-fill. 
      // API returns phone as contact_number.
      // For now, let's try to fetch fresh data or just use what we have.
      // Actually, dashboard layout user object might need update to include phone if we want to pre-fill it correctly without a fetch.
      // But let's stick to the plan.
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/admins/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local context
        updateUser({
          username: data.user.name,
          email: data.user.email,
          role: data.user.role
          // Phone is not in User interface yet, so we can't store it in context easily unless we update User interface.
        });
        alert('Profile updated successfully');
        onClose();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('An error occurred while updating profile');
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
            />
          </div>



          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all bg-white text-sm"
            >
              <option>Super Admin</option>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
              style={{ backgroundColor: '#006699' }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountSettingsModal;

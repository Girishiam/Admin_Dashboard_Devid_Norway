import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../api_integration';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AlertModal } from '../../components/ui/AlertModal';

interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  accessLevel: string;
  avatar: string;
}

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: any) => Promise<void>;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Administrator | null;
  onSave: (id: string, admin: any) => Promise<void>;
}



interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adminName: string;
}

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, adminName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{adminName}</span>'s account? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: '#006699' }}
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Alert Modal


// Create Administrator Modal
function CreateAdminModal({ isOpen, onClose, onSave }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    accessLevel: 'admin'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({ name: '', email: '', password: '', phone: '', accessLevel: 'admin' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">New Administrator Profile</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Access Level</label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all bg-white text-sm"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// Edit Administrator Modal
function EditAdminModal({ isOpen, onClose, admin, onSave }: EditAdminModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accessLevel: 'admin'
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        accessLevel: admin.accessLevel === 'Super Admin' ? 'superadmin' : 'admin'
      });
    }
  }, [admin]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admin) {
      await onSave(admin.id, formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Administrator</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Access Level</label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all bg-white text-sm"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Administrators Component
function Administrators() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Administrator | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Alert Modal State
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  const showNotification = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/admins?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch administrators');
      }

      const data = await response.json();

      if (data.admins) {
        const mappedAdmins = data.admins.map((admin: any) => ({
          id: `#${admin.id}`,
          name: admin.name,
          email: admin.email,
          phone: admin.contact_number || 'N/A',
          accessLevel: admin.role === 'superadmin' ? 'Super Admin' : 'Admin',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=006699&color=fff`
        }));
        setAdministrators(mappedAdmins);
      }

      if (data.pagination) {
        setTotalPages(data.pagination.total_pages);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load administrators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  // Removed client-side slicing since API handles pagination
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentAdministrators = administrators.slice(startIndex, endIndex);
  const currentAdministrators = administrators;

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

  const handleCreateAdmin = async (newAdmin: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/admins/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password,
          contact_number: newAdmin.phone,
          role: newAdmin.accessLevel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create administrator');
      }
      
      fetchAdmins();
    } catch (err) {
      console.error('Error creating admin:', err);
    }
  };

  const handleEditAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id: string, updatedData: any) => {
    try {
      const token = localStorage.getItem('token');
      const rawId = id.replace('#', '');
      const response = await fetch(`${BASE_URL}admin/admins/${rawId}/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email,
          contact_number: updatedData.phone,
          role: updatedData.accessLevel
        })
      });

      if (response.ok) {
        fetchAdmins();
        setShowEditModal(false); // Close modal on success
      } else {
        const data = await response.json().catch(() => ({}));
        if (response.status === 403) {
          showNotification(data.error || 'You do not have permission to edit this administrator. Super Admins cannot be edited.', 'error');
        } else {
          showNotification(data.error || 'Failed to update admin', 'error');
        }
        console.error('Failed to update admin:', response.status);
      }
    } catch (err) {
      console.error('Error updating admin:', err);
      showNotification('An error occurred while updating admin', 'error');
    }
  };



  const handleDeleteClick = (admin: Administrator) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDelete) {
      try {
        const token = localStorage.getItem('token');
        const rawId = adminToDelete.id.replace('#', '');
        const response = await fetch(`${BASE_URL}admin/admins/${rawId}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
           fetchAdmins(); // Refresh list
           setShowDeleteModal(false); // Close only on success (or always properly handled)
        } else {
           const data = await response.json().catch(() => ({}));
           if (response.status === 403) {
             showNotification(data.error || 'You do not have permission to delete this administrator. Super Admins cannot be deleted.', 'error');
           } else {
             showNotification(data.error || 'Failed to delete admin', 'error');
           }
           console.error('Failed to delete admin');
        }
      } catch (err) {
        console.error('Error deleting admin:', err);
        showNotification('An error occurred while deleting admin', 'error');
      }
      setAdminToDelete(null); // Reset selection
      // Don't close modal immediately if we want them to see the error? 
      // Actually alert blocks, so simple flow:
      setShowDeleteModal(false); 
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Create Button */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-semibold text-xs sm:text-sm hover:opacity-90 transition-all whitespace-nowrap"
            style={{ backgroundColor: '#006699' }}
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>New Administrators Profile Create</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">SL no.</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Contact Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Has Access to</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 whitespace-nowrap">Action</th>
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
                    <button onClick={fetchAdmins} className="mt-2 text-blue-600 underline text-sm">Retry</button>
                  </td>
                </tr>
              ) : currentAdministrators.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                     No administrators found.
                   </td>
                </tr>
              ) : (
              currentAdministrators.map((admin, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{admin.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{admin.name}</div>
                        <div className="text-xs text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{admin.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{admin.accessLevel}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="inline-flex items-center justify-center w-10 h-10 text-white rounded-lg transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#006699' }}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {currentAdministrators.map((admin, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img src={admin.avatar} alt={admin.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{admin.id}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {admin.accessLevel}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{admin.name}</div>
                    <div className="text-xs text-gray-600 mb-0.5 truncate">{admin.email}</div>
                    <div className="text-xs text-gray-500">{admin.phone}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditAdmin(admin)}
                    className="inline-flex items-center justify-center w-9 h-9 text-white rounded-lg transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#006699' }}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  
                  <button // This might fail if previous step removed empty lines. Let's be careful.
                    onClick={() => handleDeleteClick(admin)}
                    className="inline-flex items-center justify-center w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
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

      {/* Modals */}
      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateAdmin}
      />
      <EditAdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        admin={selectedAdmin}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAdminToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        adminName={adminToDelete?.name || ''}
      />
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}

export default Administrators;

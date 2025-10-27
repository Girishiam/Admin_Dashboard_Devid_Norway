import React, { useState } from 'react';
import { PencilIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UpdateApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSave: (newKey: string) => void;
}

// Update API Modal
function UpdateApiModal({ isOpen, onClose, currentKey, onSave }: UpdateApiModalProps) {
  const [apiKeyValue, setApiKeyValue] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);

  React.useEffect(() => {
    setApiKeyValue(currentKey);
    setShowKey(false);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKeyValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Update OpenAPI Key</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Enter your OpenAPI key"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">This key is used for OpenAI API integration</p>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main APIs Component
function APIs() {
  const envKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
  const [apiKey, setApiKey] = useState(envKey);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const maskApiKey = (key: string) => {
    if (!key || key.length <= 12) return key;
    const firstPart = key.substring(0, 6);
    const lastPart = key.substring(key.length - 6);
    const maskedLength = key.length - 12;
    return `${firstPart}${'•'.repeat(Math.min(maskedLength, 20))}${lastPart}`;
  };

  const handleSaveUpdate = (newKey: string) => {
    setApiKey(newKey);
    setShowKey(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Title */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">OpenAPI Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your OpenAI API key securely</p>
        </div>

        {/* API Key Card */}
        <div className="p-4 sm:p-5 md:p-6">
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">OpenAPI Key</h3>
                <p className="text-xs text-gray-500 mt-0.5">Used for OpenAI API integration</p>
              </div>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-all whitespace-nowrap self-start sm:self-auto"
                style={{ backgroundColor: '#006699' }}
              >
                <PencilIcon className="w-4 h-4" />
                <span>Update</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <code className="flex-1 text-xs sm:text-sm font-mono text-gray-700 break-all">
                {showKey ? apiKey : maskApiKey(apiKey)}
              </code>
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                title={showKey ? 'Hide API Key' : 'Show API Key'}
              >
                {showKey ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`} />
                {apiKey ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-gray-500">
                Last updated: Just now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <UpdateApiModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        currentKey={apiKey}
        onSave={handleSaveUpdate}
      />
    </div>
  );
}

export default APIs;

import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
}

export function AlertModal({ isOpen, onClose, message, type }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
            type === 'error' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {type === 'error' ? (
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            ) : (
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {type === 'error' ? 'Action Failed' : 'Success'}
          </h3>
          
          <p className="text-sm text-gray-500 mb-8">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold transition-all hover:opacity-90 shadow-lg shadow-blue-500/30"
            style={{ backgroundColor: '#006699' }}
          >
            Okay, Got it
          </button>
        </div>
      </div>
    </div>
  );
}

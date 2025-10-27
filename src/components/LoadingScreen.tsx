import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#f3f4f6' }}
    >
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-10 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/main-logo.png" 
              alt="Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-4">
            CALM AI
          </h1>

          {/* Spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                style={{ 
                  borderTopColor: '#07657E',
                  borderRightColor: '#07657E'
                }}
              ></div>
            </div>
          </div>

          {/* Loading Text */}
          <p className="text-center text-gray-600 font-medium text-base">
            {message}<span className="animate-pulse">...</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;

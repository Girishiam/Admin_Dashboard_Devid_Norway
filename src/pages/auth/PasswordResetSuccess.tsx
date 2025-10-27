import React from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordResetSuccess() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth/login');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" 
      style={{ backgroundColor: '#E6F0F5' }}
    >
      <div className="w-full max-w-[520px]">
        {/* Success Card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-lg text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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
          </div>

          {/* Title */}
          <h1 
            className="text-gray-900 mb-3"
            style={{
              fontSize: '28px',
              fontWeight: 500,
              lineHeight: '120%',
              letterSpacing: '-0.5px',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Password Updated Successfully!
          </h1>
          
          {/* Description */}
          <p 
            className="text-gray-600 mb-8"
            style={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '150%',
            }}
          >
            Your new password has been saved. You can now continue securely.
          </p>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="w-full h-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#006699' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#005580';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#006699';
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetSuccess;

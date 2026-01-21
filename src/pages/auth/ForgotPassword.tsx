import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { BASE_URL } from '../../api_integration';



function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const url = `${BASE_URL}admin/forgot-password`;
    console.log('Fetching URL:', url);
    console.log('Payload:', JSON.stringify({ email }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ email }),

      });

      const data = await response.json();
      console.log('Forgot password response:', data);

      if (response.ok) {
        // Navigate to OTP page with email
        navigate('/auth/verify-otp', { state: { email } });
      } else {
        if (data.error === 'Resend too soon') {
          setError(`Resend too soon. Please try again in ${data.retry_in} seconds.`);
        } else {
          console.error('Forgot password failed:', data.message || data.error || 'Unknown error');
          setError(data.message || data.error || 'Failed to send reset email');
        }
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" 
      style={{ backgroundColor: '#E6F0F5' }}
    >
      <div className="w-full max-w-[520px]">
        {/* Forgot Password Card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-lg">
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
              className="object-contain transition-transform hover:scale-105"
            />
          </div>

          {/* Title Section */}
          <div className="text-center space-y-2 mb-8">
            <h1 
              className="text-gray-900"
              style={{
                fontSize: '32px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '0px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Forget Password?
            </h1>
            <p 
              className="text-gray-600 mt-3"
              style={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '0%',
              }}
            >
              Please enter your email to get verification code
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-left text-gray-900 font-medium text-sm"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="esteban_schiller@gmail.com"
                required
                className="w-full h-[52px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400"
                onFocus={(e) => {
                  e.target.style.borderColor = '#006699';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 102, 153, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              style={{ backgroundColor: '#006699' }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#005580';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#006699';
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link 
              to="/auth/login"
              className="text-sm font-medium transition-colors duration-200 inline-flex items-center"
              style={{ color: '#006699' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

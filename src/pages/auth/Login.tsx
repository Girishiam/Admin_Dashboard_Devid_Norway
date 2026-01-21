import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

import { BASE_URL } from '../../api_integration';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Attempting login with:', { email });

    try {
      const response = await fetch(`${BASE_URL}admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        // Assuming data structure based on user input:
        // { token: "...", role: "...", username: "..." }
        if (data.token) {
           login({
             username: data.username,
             role: data.role,
             email: email
           }, data.token);
           
           // Optional: Store remember password preference
           if (rememberPassword) {
             localStorage.setItem('rememberPassword', 'true');
           }
           
           console.log('Login successful, navigating to dashboard');
           navigate('/dashboard');
        } else {
          console.error('Login failed: No token received');
          setError('Login failed: No token received');
        }
      } else {
        console.error('Login failed:', data.error || 'Unknown error');
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
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
        {/* Login Card */}
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
              Login to Account
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
              Please enter your email and password to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password Input */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-left text-gray-900 font-medium text-sm"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-[52px] px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none bg-white transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006699';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 102, 153, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Password & Forget Password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer transition-all duration-200"
                  style={{ accentColor: '#006699' }}
                />
                <span className="ml-2.5 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  Remember Password
                </span>
              </label>
              <Link 
                to="/auth/forgot-password"
                className="font-medium transition-colors duration-200"
                style={{ color: '#006699' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Forget Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] mt-6"
              style={{
                backgroundColor: '#006699',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#005580';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#006699';
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

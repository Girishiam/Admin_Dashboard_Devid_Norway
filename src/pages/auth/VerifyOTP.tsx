import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function VerifyOTP() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d+$/.test(char));
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      alert('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('OTP:', otpCode);
      // Navigate to reset password or success page
      navigate('/auth/reset-password', { state: { email, otp: otpCode } });
    }, 1500);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    alert('Verification code resent!');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" 
      style={{ backgroundColor: '#E6F0F5' }}
    >
      <div className="w-full max-w-[520px]">
        {/* OTP Card */}
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
              Check your email
            </h1>
            <p 
              className="text-gray-600 mt-3"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '150%',
              }}
            >
              We sent a code to your email address <strong className="text-gray-900">{email}</strong>.<br />
              Please check your email for the 6 digit code.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#006699] focus:ring-2 focus:ring-[#006699]/20 transition-all duration-200 bg-white"
                  style={{
                    caretColor: '#006699',
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.some(digit => !digit)}
              className="w-full h-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{ backgroundColor: '#006699' }}
              onMouseEnter={(e) => {
                if (!isLoading && otp.every(digit => digit)) {
                  e.currentTarget.style.backgroundColor = '#005580';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && otp.every(digit => digit)) {
                  e.currentTarget.style.backgroundColor = '#006699';
                }
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify'
              )}
            </button>
          </form>

          {/* Resend Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              You have not received the email?{' '}
              <button
                onClick={handleResend}
                className="font-medium transition-colors duration-200"
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
                Resend
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4">
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

export default VerifyOTP;

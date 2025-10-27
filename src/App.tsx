import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';
import Dashboard from './pages/admin/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

// Import pages
import Users from './pages/admin/Users';
import Administrators from './pages/admin/Administrators';
import Payment from './pages/admin/Payment';
import APIs from './pages/admin/APIs';
import Sessions from './pages/admin/Sessions';
import PrivacyPolicy from './pages/admin/PrivacyPolicy';
import TermsConditions from './pages/admin/TermsConditions';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load (check auth, fetch config, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Show loader for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen during initial load
  if (loading) {
    return <LoadingScreen message="Initializing" />;
  }

  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        {/* Auth Routes - Public */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/password-reset-success" element={<PasswordResetSuccess />} />

        {/* Public Standalone Pages - No Dashboard Layout */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        {/* Protected Admin Routes - WITH Dashboard Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="administrators" element={<Administrators />} />
          <Route path="payment" element={<Payment />} />
          <Route path="apis" element={<APIs />} />
          <Route path="sessions" element={<Sessions />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

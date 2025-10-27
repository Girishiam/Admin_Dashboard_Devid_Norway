export const APP_NAME = 'Admin Dashboard';
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';


export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_OTP: '/auth/verify-otp',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  ADMINISTRATORS: '/administrators',
  APIS: '/apis',
  PAYMENT: '/payment',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_CONDITIONS: '/terms-conditions',
  SESSIONS: '/sessions',
  SETTINGS: '/settings',
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_mode',
};

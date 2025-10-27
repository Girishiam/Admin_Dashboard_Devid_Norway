import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

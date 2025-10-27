import { createSlice } from '@reduxjs/toolkit';
import type { ThemeState } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';

const initialState: ThemeState = {
  mode: (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

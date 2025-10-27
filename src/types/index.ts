export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
  badge?: number;
}

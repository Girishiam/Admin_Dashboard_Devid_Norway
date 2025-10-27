import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail');
    
    if (authStatus === 'true' && userEmail) {
      setIsAuthenticated(true);
      setUser({
        email: userEmail,
        name: 'Moni Roy',
        role: 'Super Admin'
      });
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simulate login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUser({
      email,
      name: 'Moni Roy',
      role: 'Super Admin'
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

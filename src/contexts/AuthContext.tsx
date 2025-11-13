import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (requiredRole: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, login, logout, checkPermission } = useAuthStore();

  useEffect(() => {
    // Check for stored authentication on app load
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      // In a real app, you'd validate this token with your backend
      const authData = JSON.parse(storedAuth);
      // Restore authentication state if needed
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    logout();
  };

  const handleLogin = async (username: string, password: string) => {
    const success = await login(username, password);
    if (success) {
      localStorage.setItem('auth', JSON.stringify({ username, timestamp: Date.now() }));
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
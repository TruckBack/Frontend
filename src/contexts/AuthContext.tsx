import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/auth';
import { storage } from '../services/storage';
import type { AccountRole, User } from '../services/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, role: AccountRole) => Promise<void>;
  register: (username: string, password: string, email: string, role: AccountRole) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (role: AccountRole) => Promise<void>;
  loginWithFacebook: (role: AccountRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const accessToken = storage.getToken();

    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role: AccountRole) => {
    const response = await authService.login({ username, password, role });
    setUser(response);
    localStorage.setItem('user', JSON.stringify(response));
  };

  const register = async (username: string, password: string, email: string, role: AccountRole) => {
    const user = await authService.register({ username, password, email, role });
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const loginWithGoogle = async (role: AccountRole) => {
    const url = await authService.loginWithGoogle(role);
    window.location.href = url;
  };

  const loginWithFacebook = async (role: AccountRole) => {
    const url = await authService.loginWithFacebook(role);
    window.location.href = url;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

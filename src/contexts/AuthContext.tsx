import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/auth';
import { storage } from '../services/storage';
import type {
  User,
  LoginRequest,
  CustomerRegister,
  DriverRegister,
  UserRole,
} from '../services/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (
    data: CustomerRegister | DriverRegister,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  loginWithFacebook: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = storage.getAccessToken();
      if (accessToken) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to fetch user', error);
          storage.clearTokens(); // Clear tokens if getMe fails
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response);
    // User is now stored in localStorage by the service
  };

  const register = async (
    data: CustomerRegister | DriverRegister,
    role: UserRole
  ) => {
    // The register endpoint in the spec doesn't log the user in.
    // It just creates the user. After registration, the user should be
    // redirected to the login page to log in with their new credentials.
    await authService.register(data, role);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const loginWithGoogle = async (role: UserRole) => {
    const url = await authService.loginWithGoogle(role);
    if (url !== '#') {
      window.location.href = url;
    }
  };

  const loginWithFacebook = async (role: UserRole) => {
    const url = await authService.loginWithFacebook(role);
    if (url !== '#') {
      window.location.href = url;
    }
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

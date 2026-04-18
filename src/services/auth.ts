import axios from 'axios';
import apiClient from './api';
import { storage } from './storage';
import type { AccountRole, AuthResponse, OAuthResponse, User } from './types';

interface LoginPayload {
  username: string;
  password: string;
  role: AccountRole;
}

interface RegisterPayload extends LoginPayload {
  email: string;
}

const normalizeUser = (user: User, role: AccountRole): User => ({
  ...user,
  role: user.role ?? role,
});

export const authService = {
  async register(data: RegisterPayload): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Server sets HttpOnly Cookie (RefreshToken)
    storage.setToken(response.data.accessToken);
    return normalizeUser(response.data.user, data.role);
  },

  async login(data: LoginPayload): Promise<User> {
    // const response = await apiClient.post<AuthResponse>('/auth/login', data);

    // Server sets HttpOnly Cookie (RefreshToken)
    // storage.setToken(response.data.accessToken);
    // return normalizeUser(response.data.user, data.role);
    storage.setToken(`mock-${data.role}-access-token`);

    return {
      email: 'example@example.com',
      id: '12345',
      name: `${data.role === 'driver' ? 'Driver' : 'Customer'} User`,
      role: data.role,
    };
  },

  async logout(): Promise<void> {
    try {
      // Server Side: sends "Set-Cookie: refreshToken=; Max-Age=0" (res.clearCookie)
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      storage.clearToken();
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  isAuthenticated(): boolean {
    return !!storage.getToken();
  },


  async loginWithGoogle(role: AccountRole = 'customer'): Promise<string> {
    try {
      const response = await apiClient.get<OAuthResponse>('/auth/google', {
        params: { role },
      });
      return response.data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Failed to get Google OAuth URL');
      }
      throw error;
    }
  },

  async loginWithFacebook(role: AccountRole = 'customer'): Promise<string> {
    try {
      const response = await apiClient.get<OAuthResponse>('/auth/facebook', {
        params: { role },
      });
      return response.data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Failed to get Facebook OAuth URL');
      }
      throw error;
    }
  }
};

export default authService;
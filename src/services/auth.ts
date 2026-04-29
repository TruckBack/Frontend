import apiService from './api';
import { storage } from './storage';
import type {
  User,
  TokenResponse,
  CustomerRegister,
  DriverRegister,
  LoginRequest,
  UserRole,
} from './types';

export const authService = {
  async register(
    data: CustomerRegister | DriverRegister,
    role: UserRole
  ): Promise<User> {
    const endpoint =
      role === 'customer'
        ? '/auth/register/customer'
        : '/auth/register/driver';
    const response = await apiService.post<User>(endpoint, data);
    // After registration, the user should probably log in.
    // The registration endpoint in the spec returns a User, not tokens.
    return response.data;
  },

  async login(data: LoginRequest): Promise<User> {
    const response = await apiService.post<TokenResponse>(
      '/auth/login/json',
      data
    );

    

    const { access_token, refresh_token } = response.data;
    storage.setAccessToken(access_token);
    storage.setRefreshToken(refresh_token);

    const user = await this.getMe();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async getMe(): Promise<User> {
    const response = await apiService.get<User>('/users/me');
    return response.data;
  },

  async logout(): Promise<void> {
    storage.clearTokens();
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return !!storage.getAccessToken();
  },

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    // TODO: No password change endpoint exists in the API spec yet.
    throw new Error('Password change is not yet supported. Please contact support.');
  },

  // These are not in the openapi spec, so they will likely fail if used.
  // Keeping them for now to avoid breaking the UI immediately.
  async loginWithGoogleToken(idToken: string, role: UserRole): Promise<User> {
    // POST /auth/google — backend must verify the Google ID token and return a TokenResponse.
    const response = await apiService.post<TokenResponse>('/auth/google', { id_token: idToken, role });
    const { access_token, refresh_token } = response.data;
    storage.setAccessToken(access_token);
    storage.setRefreshToken(refresh_token);
    const user = await this.getMe();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async loginWithGoogle(_role: UserRole = 'customer'): Promise<string> {
    // This endpoint does not exist in the provided spec.
    // This will need to be implemented in the backend.
    console.warn('loginWithGoogle is not implemented in the backend');
    return Promise.resolve('#');
  },

  
};

export default authService;
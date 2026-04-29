import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { storage } from './storage';
import type { TokenResponse } from './types';

const apiService: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue Mechanism (Handles concurrent 401s)
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Auth endpoints returning 401 mean bad credentials — don't attempt token refresh
    if (originalRequest.url?.startsWith('/auth/')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiService(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      storage.clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${apiService.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token } = response.data;

      storage.setAccessToken(access_token);
      storage.setRefreshToken(refresh_token);

      apiService.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      processQueue(null, access_token);

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return apiService(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      storage.clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiService;

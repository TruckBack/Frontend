const ACCESS_TOKEN_KEY = 'auth_access_token';

export const storage = {
    getToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    setToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    clearToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};
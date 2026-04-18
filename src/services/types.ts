export type AccountRole = 'customer' | 'driver';

export interface User {
    id: string;
    email: string;
    name: string;
    role: AccountRole;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface OAuthResponse {
    url: string;
}

export interface ApiError {
    message: string;
    code: string;
}
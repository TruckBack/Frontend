export type UserRole = 'customer' | 'driver' | 'admin';

export type DriverStatus = 'offline' | 'available' | 'busy';

export type OrderStatus =
    | 'pending'
    | 'accepted'
    | 'in_progress'
    | 'picked_up'
    | 'completed'
    | 'cancelled';

export interface User {
    id: string;
    full_name: string;
    role: UserRole;
    profile_image_url?: string | null;
    created_at: string;
    email: string;
    phone?: string | null;
    is_active: boolean;
}

export interface UserPublic {
    id: number;
    full_name: string;
    role: UserRole;
    profile_image_url?: string | null;
    created_at: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type?: string;
    expires_in: number;
}

export interface CustomerRegister {
    email: string;
    password?: string;
    full_name: string;
    phone?: string | null;
}

export interface DriverRegister extends CustomerRegister {
    license_number: string;
    vehicle_type: string;
    vehicle_plate: string;
    vehicle_capacity_kg?: number | null;
}

export interface LoginRequest {
    email: string;
    password?: string;
    role?: UserRole;
}

export interface UserUpdate {
    full_name?: string | null;
    phone?: string | null;
    profile_image_url?: string | null;
}

export interface DriverProfile {
    id: number;
    user_id: number;
    license_number: string;
    vehicle_type: string;
    vehicle_plate: string;
    vehicle_capacity_kg?: number | null;
    status: DriverStatus;
    current_lat?: number | null;
    current_lng?: number | null;
    last_location_at?: string | null;
    rating: number;
}

export interface DriverProfileUpdate {
    vehicle_type?: string | null;
    vehicle_plate?: string | null;
    vehicle_capacity_kg?: number | null;
}

export interface DriverStatusUpdate {
    status: DriverStatus;
}

export interface DriverLocationUpdate {
    lat: number;
    lng: number;
}

export interface Order {
    id: number;
    customer_id: number;
    driver_id?: number | null;
    status: OrderStatus;
    pickup_address: string;
    pickup_lat: number;
    pickup_lng: number;
    dropoff_address: string;
    dropoff_lat: number;
    dropoff_lng: number;
    cargo_description?: string | null;
    cargo_weight_kg?: number | null;
    notes?: string | null;
    cargo_image_url?: string | null;
    price_cents: number;
    currency: string;
    accepted_at?: string | null;
    started_at?: string | null;
    picked_up_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderCreate {
    pickup_address: string;
    pickup_lat: number;
    pickup_lng: number;
    dropoff_address: string;
    dropoff_lat: number;
    dropoff_lng: number;
    cargo_description?: string | null;
    cargo_weight_kg?: number | null;
    notes?: string | null;
    price_cents: number;
    currency?: string;
}

export interface OrderUpdate {
    pickup_address?: string;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_address?: string;
    dropoff_lat?: number;
    dropoff_lng?: number;
    cargo_description?: string | null;
    cargo_weight_kg?: number | null;
    notes?: string | null;
    price_cents?: number;
    currency?: string;
    cargo_image_url?: string | null;
}

export interface OrderCancel {
    reason?: string | null;
}

export interface Page<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}

export interface PresignedUploadRequest {
    filename: string;
    content_type: string;
}

export interface PresignedUploadResponse {
    upload_url: string;
    method?: string;
    headers: Record<string, string>;
    key: string;
    public_url: string;
    expires_in: number;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
    input?: any;
    ctx?: object;
}

export interface HTTPValidationError {
    detail?: ValidationError[];
}

export interface OAuthResponse {
    url: string;
}

export type AccountRole = 'customer' | 'driver';

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface ApiError {
    message: string;
    code: string;
}

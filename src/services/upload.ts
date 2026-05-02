import apiService from './api';

/**
 * Converts a server-returned relative image path (e.g. "/uploads/profile-images/3/abc.jpg")
 * into a fully-qualified URL by prepending the backend origin derived from VITE_API_URL.
 * Returns undefined when path is null/undefined (no image — show a placeholder instead).
 */
export function resolveImageUrl(path: string | null | undefined): string | undefined {
    if (!path) return undefined;
    const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1';
    // Strip the /api/v1 suffix to get just the server origin
    const origin = apiUrl.replace(/\/api\/v1\/?$/, '');
    return `${origin}${path}`;
}

export const uploadService = {
    /** Upload (or replace) the current user's profile image. POST /uploads/image/profile */
    uploadProfileImage(file: File): Promise<{ profile_image_url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return apiService
            .post('/uploads/image/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(res => res.data);
    },

    /** Delete the current user's profile image. DELETE /uploads/image/profile */
    deleteProfileImage(): Promise<void> {
        return apiService.delete('/uploads/image/profile').then(() => undefined);
    },

    /** Upload (or replace) the cargo image for an order. POST /uploads/image/order/:id */
    uploadOrderImage(orderId: number, file: File): Promise<{ cargo_image_url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return apiService
            .post(`/uploads/image/order/${orderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(res => res.data);
    },

    /** Delete the cargo image for an order. DELETE /uploads/image/order/:id */
    deleteOrderImage(orderId: number): Promise<void> {
        return apiService.delete(`/uploads/image/order/${orderId}`).then(() => undefined);
    },
};

import apiService from './api';
import type { PresignedUploadRequest, PresignedUploadResponse } from './types';

export const uploadService = {
    getPresignedProfileImageUploadUrl(data: PresignedUploadRequest): Promise<PresignedUploadResponse> {
        return apiService.post('/uploads/image/profile', data).then(res => res.data);
    },

    async uploadFile(url: string, file: File, headers: Record<string, string>): Promise<void> {
        const response = await fetch(url, { method: 'PUT', body: file, headers });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
    },

    uploadOrderImage(orderId: number, file: File): Promise<{ cargo_image_url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return apiService
            .post(`/uploads/image/order/${orderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(res => res.data);
    },
};

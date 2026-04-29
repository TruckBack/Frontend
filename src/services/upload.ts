import apiService from './api';
import type { PresignedUploadRequest, PresignedUploadResponse } from './types';

export const uploadService = {
    getPresignedProfileImageUploadUrl(data: PresignedUploadRequest): Promise<PresignedUploadResponse> {
        return apiService.post('/uploads/image/profile', data).then(res => res.data);
    },

    async uploadFile(url: string, file: File, headers: Record<string, string>): Promise<void> {
        // Use native fetch so the apiService auth interceptor doesn't inject
        // an Authorization header into presigned storage upload requests.
        const response = await fetch(url, { method: 'PUT', body: file, headers });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
    }
};

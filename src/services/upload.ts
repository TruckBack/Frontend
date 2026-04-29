import apiService from './api';
import type { PresignedUploadRequest, PresignedUploadResponse } from './types';

export const uploadService = {
    getPresignedProfileImageUploadUrl(data: PresignedUploadRequest): Promise<PresignedUploadResponse> {
        return apiService.post('/uploads/image/profile', data).then(res => res.data);
    },

    async uploadFile(url: string, file: File, headers: Record<string, string>): Promise<void> {
        await apiService.put(url, file, { headers });
    }
};

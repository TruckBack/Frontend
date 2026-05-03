import apiService from './api';
import type {
    DriverProfile,
    DriverProfileUpdate,
    DriverStatusUpdate,
    DriverLocationUpdate,
    DriverRatingsPage,
} from './types';

export const driverService = {
    // Try GET first (backend likely has this even if the openapi.json is outdated).
    // Fall back to PUT with an empty body as a last resort.
    getMyProfile(): Promise<DriverProfile> {
        return apiService.get('/drivers/me/profile')
            .then(res => res.data)
            .catch(() => apiService.put('/drivers/me/profile', {}).then(res => res.data));
    },

    updateProfile(data: DriverProfileUpdate): Promise<DriverProfile> {
        return apiService.put('/drivers/me/profile', data).then(res => res.data);
    },

    updateStatus(data: DriverStatusUpdate): Promise<DriverProfile> {
        return apiService.put('/drivers/me/status', data).then(res => res.data);
    },

    updateLocation(data: DriverLocationUpdate): Promise<DriverProfile> {
        return apiService.post('/drivers/me/location', data).then(res => res.data);
    },

    listDriverRatings(driverId: number, limit = 20, offset = 0): Promise<DriverRatingsPage> {
        return apiService.get(`/drivers/${driverId}/ratings`, { params: { limit, offset } }).then(res => res.data);
    },
};

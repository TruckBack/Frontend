import apiService from './api';
import type {
    DriverProfile,
    DriverProfileUpdate,
    DriverStatusUpdate,
    DriverLocationUpdate,
} from './types';

export const driverService = {
    updateProfile(data: DriverProfileUpdate): Promise<DriverProfile> {
        return apiService.put('/drivers/me/profile', data).then(res => res.data);
    },

    updateStatus(data: DriverStatusUpdate): Promise<DriverProfile> {
        return apiService.put('/drivers/me/status', data).then(res => res.data);
    },

    updateLocation(data: DriverLocationUpdate): Promise<DriverProfile> {
        return apiService.post('/drivers/me/location', data).then(res => res.data);
    },
};

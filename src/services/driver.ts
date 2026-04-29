import apiService from './api';
import type {
    DriverProfile,
    DriverProfileUpdate,
    DriverStatusUpdate,
    DriverLocationUpdate,
} from './types';

export const driverService = {
    // There is no GET /drivers/me/profile endpoint in the spec.
    // PUT with an empty body is a safe no-op since all update fields are optional.
    getMyProfile(): Promise<DriverProfile> {
        return apiService.put('/drivers/me/profile', {}).then(res => res.data);
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
};

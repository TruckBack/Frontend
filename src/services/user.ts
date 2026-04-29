import apiService from './api';
import type { User, UserUpdate, UserPublic } from './types';

export const userService = {
    updateMe(data: UserUpdate): Promise<User> {
        return apiService.put('/users/me', data).then(res => res.data);
    },

    getUser(userId: number): Promise<UserPublic> {
        return apiService.get(`/users/${userId}`).then(res => res.data);
    },
};

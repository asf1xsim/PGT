// matchmaking-service/src/services/profile.service.ts
import axios from 'axios';

const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:3002';

export const profileService = {
    async getById(id: string) {
        try {
            const response = await axios.get(`${PROFILE_SERVICE_URL}/profiles/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    async getByUserId(userId: string) {
        try {
            const response = await axios.get(`${PROFILE_SERVICE_URL}/profiles/user/${userId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }
};
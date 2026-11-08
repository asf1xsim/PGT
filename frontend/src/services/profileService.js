// frontend/src/service/profileService.js
import api from './api';

export const profileService = {
  async getAll() {
    const response = await api.get('/profiles');
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  async create(profileData) {
    const response = await api.post('/profiles', profileData);
    return response.data;
  },

  async update(id, profileData) {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data;
  },

  async updateOnlineStatus(id, isOnline) {
    const response = await api.put(`/profiles/${id}/online`, { isOnline });
    return response.data;
  },

  async delete(id) {
    await api.delete(`/profiles/${id}`);
  },

  async search(query) {
    const response = await api.get('/profiles/search', {
      params: { query }
    });
    return response.data;
  }
};
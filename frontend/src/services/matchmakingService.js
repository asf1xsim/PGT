// frontend/src/service/matchmakingService.js
import api from './api';

export const matchmakingService = {
  async createMatchRequest(requesterProfileId, targetProfileId, game, message) {
    const response = await api.post('/matches', {
      requesterProfileId,
      targetProfileId,
      game,
      message
    });
    return response.data;
  },

  async getMatch(id) {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  async acceptMatch(id) {
    const response = await api.put(`/matches/${id}/accept`);
    return response.data;
  },

  async declineMatch(id) {
    const response = await api.put(`/matches/${id}/decline`);
    return response.data;
  },

  async findMatches(page = 1, limit = 10) {
    const response = await api.get('/matches/find', {
      params: { page, limit }
    });
    return response.data;
  }
};
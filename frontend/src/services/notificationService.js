// frontend/src/service/notificationService.js
import api from './api';

export const notificationService = {
  async linkTelegram(userId, chatId) {
    const response = await api.post('/notifications/link-telegram', {
      userId,
      chatId
    });
    return response.data;
  },

  async sendNotification(userId, type, title, message) {
    const response = await api.post('/notifications/send', {
      userId,
      type,
      title,
      message
    });
    return response.data;
  },

  async getNotifications(userId, limit = 20) {
    const response = await api.get(`/notifications/${userId}`, {
      params: { limit }
    });
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async deleteNotification(notificationId) {
    await api.delete(`/notifications/${notificationId}`);
  }
};
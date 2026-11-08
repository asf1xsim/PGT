// frontend/src/service/authService.js
import api from './api';

export const authService = {
  async register(username, email, password) {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async verifyToken(token) {
    const response = await api.post('/auth/verify', { token });
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
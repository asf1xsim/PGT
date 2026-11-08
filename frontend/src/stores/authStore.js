// frontend/src/stores/authStore.js
import { defineStore } from 'pinia';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: authService.isAuthenticated(),
  }),

  actions: {
    async login(email, password) {
      try {
        const data = await authService.login(email, password);
        this.user = data.user;
        this.token = data.token;
        this.isAuthenticated = true;
        return data;
      } catch (error) {
        throw error;
      }
    },

    async register(username, email, password) {
      try {
        const data = await authService.register(username, email, password);
        return data;
      } catch (error) {
        throw error;
      }
    },

    async logout() {
      try {
        await authService.logout();
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
      } catch (error) {
        console.error('Logout error:', error);
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
      }
    },

    async getProfile() {
      try {
        const data = await authService.getProfile();
        this.user = data;
        return data;
      } catch (error) {
        throw error;
      }
    },
  },
});
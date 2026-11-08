// frontend/src/service/chatService.js
import api from './api';
import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3003', {
        transports: ['websocket'],
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to chat WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from chat WebSocket');
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinMatch(matchId) {
    if (this.socket) {
      this.socket.emit('join_match', { matchId });
    }
  }

  leaveMatch(matchId) {
    if (this.socket) {
      this.socket.emit('leave_match', { matchId });
    }
  }

  sendMessage(matchId, senderId, content) {
    if (this.socket) {
      this.socket.emit('send_message', {
        matchId,
        senderId,
        content
      });
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  offMessage() {
    if (this.socket) {
      this.socket.off('new_message');
    }
  }

  async getHistory(matchId, limit = 50) {
    const response = await api.get(`/chat/history/${matchId}`, {
      params: { limit }
    });
    return response.data;
  }

  async deleteMessage(messageId) {
    await api.delete(`/chat/message/${messageId}`);
  }
}

export const chatService = new ChatService();
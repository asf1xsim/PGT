"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = initializeWebSocket;
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../services/chat.service");
function initializeWebSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    chat_service_1.chatService.setSocketIO(io);
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on('join_match', (data) => {
            const { matchId, userId } = data;
            const roomName = `match_${matchId}`;
            socket.join(roomName);
            console.log(`User ${userId} joined match ${matchId}`);
            socket.to(roomName).emit('user_joined', {
                userId,
                matchId,
                timestamp: new Date()
            });
        });
        socket.on('leave_match', (data) => {
            const { matchId, userId } = data;
            const roomName = `match_${matchId}`;
            socket.leave(roomName);
            console.log(`User ${userId} left match ${matchId}`);
            socket.to(roomName).emit('user_left', {
                userId,
                matchId,
                timestamp: new Date()
            });
        });
        socket.on('send_message', async (data) => {
            try {
                const { matchId, senderId, content } = data;
                if (!matchId || !senderId || !content) {
                    socket.emit('error', {
                        message: 'Missing required fields'
                    });
                    return;
                }
                if (content.length > 1000) {
                    socket.emit('error', {
                        message: 'Message too long (max 1000 characters)'
                    });
                    return;
                }
                const savedMessage = await chat_service_1.chatService.saveMessage({
                    matchId,
                    senderId,
                    content,
                    timestamp: new Date()
                });
                io.to(`match_${matchId}`).emit('new_message', savedMessage);
                console.log(`Message sent in match ${matchId}`);
            }
            catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', {
                    message: 'Failed to send message'
                });
            }
        });
        socket.on('typing_start', (data) => {
            const { matchId, userId, username } = data;
            const roomName = `match_${matchId}`;
            socket.to(roomName).emit('user_typing', {
                userId,
                username,
                matchId,
                isTyping: true
            });
        });
        socket.on('typing_stop', (data) => {
            const { matchId, userId, username } = data;
            const roomName = `match_${matchId}`;
            socket.to(roomName).emit('user_typing', {
                userId,
                username,
                matchId,
                isTyping: false
            });
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
    console.log('WebSocket server initialized');
    return io;
}
exports.default = initializeWebSocket;

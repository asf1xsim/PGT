// chat-service/src/websocket/chat.websocket.ts
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { chatService } from '../services/chat.service';

interface MessageData {
    matchId: string;
    senderId: string;
    content: string;
}

interface TypingData {
    matchId: string;
    userId: string;
    username: string;
}

interface JoinRoomData {
    matchId: string;
    userId: string;
}

export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    chatService.setSocketIO(io);

    io.on('connection', (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join_match', (data: JoinRoomData) => {
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

        socket.on('leave_match', (data: JoinRoomData) => {
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

        socket.on('send_message', async (data: MessageData) => {
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
                const savedMessage = await chatService.saveMessage({
                    matchId,
                    senderId,
                    content,
                    timestamp: new Date()
                });

                io.to(`match_${matchId}`).emit('new_message', savedMessage);

                console.log(`Message sent in match ${matchId}`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', {
                    message: 'Failed to send message'
                });
            }
        });

        socket.on('typing_start', (data: TypingData) => {
            const { matchId, userId, username } = data;
            const roomName = `match_${matchId}`;

            socket.to(roomName).emit('user_typing', {
                userId,
                username,
                matchId,
                isTyping: true
            });
        });

        socket.on('typing_stop', (data: TypingData) => {
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

export default initializeWebSocket;
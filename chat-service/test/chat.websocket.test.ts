// chat-service/test/chat.websocket.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { io as ioClient, Socket } from 'socket.io-client';
import { Server } from 'http';
import mongo from '../src/database/mongo';

describe('Chat WebSocket Integration Tests', () => {
    let serverInstance: Server;
    let clientSocket1: Socket;
    let clientSocket2: Socket;
    const port = 3007;
    const matchId = 'test-match-123';
    const userId1 = 'user-1';
    const userId2 = 'user-2';

    const waitFor = (socket: Socket, event: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                socket.off(event);
                reject(new Error(`Timeout waiting for event: ${event}`));
            }, 4000);

            socket.once(event, (data) => {
                clearTimeout(timeout);
                resolve(data);
            });
        });
    };

    beforeAll(async () => {
        await mongo.connect();
        process.env.PORT = String(port);
        const { httpServer } = await import('../src/server');

        await new Promise<void>((resolve) => {
            serverInstance = httpServer.listen(port, () => {
                console.log(`Test server started on port ${port}`);
                resolve();
            });
        });
    });

    afterAll(async () => {
        if (clientSocket1?.connected) clientSocket1.close();
        if (clientSocket2?.connected) clientSocket2.close();

        await new Promise<void>((resolve) => {
            if (serverInstance) {
                serverInstance.close(() => resolve());
            } else {
                resolve();
            }
        });
        await mongo.disconnect();
    });

    beforeEach(async () => {
        if (mongo.db) {
            await mongo.db.collection('messages').deleteMany({});
        }

        clientSocket1 = ioClient(`http://localhost:${port}`, { transports: ['websocket'] });
        clientSocket2 = ioClient(`http://localhost:${port}`, { transports: ['websocket'] });

        await Promise.all([
            new Promise<void>(resolve => clientSocket1.on('connect', resolve)),
            new Promise<void>(resolve => clientSocket2.on('connect', resolve))
        ]);
    });

    afterEach(() => {
        clientSocket1.removeAllListeners();
        clientSocket2.removeAllListeners();
        if (clientSocket1.connected) clientSocket1.close();
        if (clientSocket2.connected) clientSocket2.close();
    });

    describe('Connection', () => {
        it('should connect successfully', () => {
            expect(clientSocket1.connected).toBe(true);
            expect(clientSocket2.connected).toBe(true);
        });
    });

    describe('Join Match', () => {
        it('should allow user to join match', async () => {
            clientSocket2.emit('join_match', { userId: userId2, matchId: matchId });
            await new Promise(r => setTimeout(r, 100));

            const joinPromise = waitFor(clientSocket2, 'user_joined');

            clientSocket1.emit('join_match', { userId: userId1, matchId: matchId });

            const data = await joinPromise;
            expect(data.userId).toBe(userId1);
            expect(data.matchId).toBe(matchId);
        });
    });

    describe('Send Message', () => {
        it('should send and receive messages', async () => {
            const messageContent = 'Hello from test!';

            clientSocket1.emit('join_match', { userId: userId1, matchId: matchId });
            clientSocket2.emit('join_match', { userId: userId2, matchId: matchId });
            await new Promise(r => setTimeout(r, 100));

            const messagePromise = waitFor(clientSocket2, 'new_message');

            clientSocket1.emit('send_message', {
                matchId: matchId,
                senderId: userId1,
                content: messageContent
            });

            const message = await messagePromise;
            expect(message.content).toBe(messageContent);
            expect(message.senderId).toBe(userId1);
        });

        it('should save message to database', async () => {
            const messageContent = 'Test message for DB';

            clientSocket1.emit('join_match', { userId: userId1, matchId: matchId });
            await new Promise(r => setTimeout(r, 100));

            const messagePromise = waitFor(clientSocket1, 'new_message');

            clientSocket1.emit('send_message', {
                matchId: matchId,
                senderId: userId1,
                content: messageContent
            });

            await messagePromise;

            if (mongo.db) {
                const savedMessage = await mongo.db
                    .collection('messages')
                    .findOne({ content: messageContent, matchId: matchId });

                expect(savedMessage).not.toBeNull();
                expect(savedMessage?.content).toBe(messageContent);
            }
        });

        it('should reject empty messages', async () => {
            const errorPromise = waitFor(clientSocket1, 'error');

            clientSocket1.emit('send_message', {
                matchId: matchId,
                senderId: userId1,
                content: ''
            });

            const error = await errorPromise;
            expect(error.message).toBeDefined();
        });
    });

    describe('Typing Indicator', () => {
        it('should broadcast typing start', async () => {
            clientSocket1.emit('join_match', { userId: userId1, matchId: matchId });
            clientSocket2.emit('join_match', { userId: userId2, matchId: matchId });
            await new Promise(r => setTimeout(r, 100));

            const typingPromise = waitFor(clientSocket2, 'user_typing');

            clientSocket1.emit('typing_start', {
                matchId: matchId,
                userId: userId1,
                username: 'User 1'
            });

            const data = await typingPromise;
            expect(data.userId).toBe(userId1);
            expect(data.isTyping).toBe(true);
        });
    });

    describe('Multiple Users', () => {
        it('should handle multiple users in same match', async () => {
            const client3 = ioClient(`http://localhost:${port}`);
            const userId3 = 'user-3';

            await new Promise<void>(resolve => client3.on('connect', resolve));

            clientSocket1.emit('join_match', { userId: userId1, matchId: matchId });
            clientSocket2.emit('join_match', { userId: userId2, matchId: matchId });
            client3.emit('join_match', { userId: userId3, matchId: matchId });

            await new Promise(r => setTimeout(r, 200));

            const p1 = waitFor(clientSocket1, 'new_message');
            const p2 = waitFor(clientSocket2, 'new_message');
            const p3 = waitFor(client3, 'new_message');

            clientSocket1.emit('send_message', {
                matchId: matchId,
                senderId: userId1,
                content: 'Hello everyone!'
            });

            await Promise.all([p1, p2, p3]);
            client3.close();
        });
    });
});
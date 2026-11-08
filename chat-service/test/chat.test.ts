// chat-service/test/chat.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { ObjectId } from 'mongodb';
import mongo from '../src/database/mongo';
import app from '../src/app';

describe('Chat Service Integration Tests', () => {
    let messagesCollection: any;
    beforeAll(async () => {
        await mongo.connect();
        messagesCollection = mongo.db!.collection('messages');
    });

    afterAll(async () => {
        await mongo.disconnect();
    });

    beforeEach(async () => {
        await messagesCollection.deleteMany({});
    });

    describe('GET /chat/history/:id', () => {
        it('should get chat history for a match', async () => {
            const matchId = new ObjectId().toString();
            const senderId = new ObjectId().toString();

            await messagesCollection.insertMany([
                {
                    matchId,
                    senderId,
                    content: 'Hello!',
                    timestamp: new Date('2024-01-01')
                },
                {
                    matchId,
                    senderId,
                    content: 'How are you?',
                    timestamp: new Date('2024-01-02')
                }
            ]);

            const response = await request(app)
                .get(`/chat/history/${matchId}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
            expect(response.body[0].content).toBeDefined();
        });

        it('should return empty array for non-existent match', async () => {
            const matchId = new ObjectId().toString();

            const response = await request(app)
                .get(`/chat/history/${matchId}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });

        it('should limit number of messages', async () => {
            const matchId = new ObjectId().toString();
            const senderId = new ObjectId().toString();

            // Создаем 100 сообщений
            const messages = Array.from({ length: 100 }, (_, i) => ({
                matchId,
                senderId,
                content: `Message ${i}`,
                timestamp: new Date()
            }));

            await messagesCollection.insertMany(messages);

            const response = await request(app)
                .get(`/chat/history/${matchId}?limit=10`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(10);
        });

        it('should fail with invalid match ID', async () => {
            const response = await request(app)
                .get('/chat/history/invalid-id')
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });

    describe('POST /chat/message', () => {
        it('should send a message successfully', async () => {
            const messageData = {
                matchId: new ObjectId().toString(),
                senderId: new ObjectId().toString(),
                content: 'Hello, want to play?'
            };

            const response = await request(app)
                .post('/chat/message')
                .send(messageData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.content).toBe(messageData.content);
            expect(response.body.matchId).toBe(messageData.matchId);
            expect(response.body.senderId).toBe(messageData.senderId);
        });

        it('should fail with missing matchId', async () => {
            const messageData = {
                senderId: new ObjectId().toString(),
                content: 'Hello!'
            };

            const response = await request(app)
                .post('/chat/message')
                .send(messageData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
            expect(response.body.message).toContain('matchId');
        });

        it('should fail with missing senderId', async () => {
            const messageData = {
                matchId: new ObjectId().toString(),
                content: 'Hello!'
            };

            const response = await request(app)
                .post('/chat/message')
                .send(messageData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
            expect(response.body.message).toContain('senderId');
        });

        it('should fail with missing content', async () => {
            const messageData = {
                matchId: new ObjectId().toString(),
                senderId: new ObjectId().toString()
            };

            const response = await request(app)
                .post('/chat/message')
                .send(messageData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
            expect(response.body.message).toContain('content');
        });

        it('should fail with content exceeding 1000 characters', async () => {
            const messageData = {
                matchId: new ObjectId().toString(),
                senderId: new ObjectId().toString(),
                content: 'a'.repeat(1001)
            };

            const response = await request(app)
                .post('/chat/message')
                .send(messageData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
            expect(response.body.message).toContain('1000 characters');
        });
    });

    describe('DELETE /chat/message/:id', () => {
        it('should delete a message successfully', async () => {
            const message = {
                matchId: new ObjectId().toString(),
                senderId: new ObjectId().toString(),
                content: 'Test message',
                timestamp: new Date()
            };

            const result = await messagesCollection.insertOne(message);
            const messageId = result.insertedId.toString();

            await request(app)
                .delete(`/chat/message/${messageId}`)
                .expect(204);

            // Проверяем что сообщение удалено
            const deletedMessage = await messagesCollection.findOne({
                _id: new ObjectId(messageId)
            });
            expect(deletedMessage).toBeNull();
        });

        it('should fail when deleting non-existent message', async () => {
            const messageId = new ObjectId().toString();

            const response = await request(app)
                .delete(`/chat/message/${messageId}`)
                .expect(404);

            expect(response.body.status).toBe('not found');
        });

        it('should fail with invalid message ID', async () => {
            const response = await request(app)
                .delete('/chat/message/invalid-id')
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });
});
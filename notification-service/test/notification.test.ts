// notification-service/test/notification.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { ObjectId } from 'mongodb';
import mongo from '../src/database/mongo';
import app from '../src/app';

describe('Notification Service Integration Tests', () => {
    let notificationsCollection: any;
    let telegramUsersCollection: any;

    beforeAll(async () => {
        await mongo.connect();
        notificationsCollection = mongo.db!.collection('notifications');
        telegramUsersCollection = mongo.db!.collection('telegram_users');
    });

    afterAll(async () => {
        await mongo.disconnect();
    });

    beforeEach(async () => {
        await notificationsCollection.deleteMany({});
        await telegramUsersCollection.deleteMany({});
    });

    describe('POST /notifications/link-telegram', () => {
        it('should link telegram account successfully', async () => {
            const linkData = {
                userId: new ObjectId().toString(),
                chatId: '123456789'
            };

            const response = await request(app)
                .post('/notifications/link-telegram')
                .send(linkData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.userId).toBe(linkData.userId);
            expect(response.body.chatId).toBe(linkData.chatId);
        });

        it('should fail with missing userId', async () => {
            const linkData = {
                chatId: '123456789'
            };

            const response = await request(app)
                .post('/notifications/link-telegram')
                .send(linkData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });

    describe('POST /notifications/send', () => {
        it('should send notification successfully', async () => {
            const notificationData = {
                userId: new ObjectId().toString(),
                type: 'match_request',
                title: 'New Match Request',
                message: 'Player123 wants to play with you!'
            };

            const response = await request(app)
                .post('/notifications/send')
                .send(notificationData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.userId).toBe(notificationData.userId);
            expect(response.body.type).toBe(notificationData.type);
            expect(response.body.read).toBe(false);
        });

        it('should fail with missing required fields', async () => {
            const notificationData = {
                userId: new ObjectId().toString(),
                type: 'match_request'
                // missing title and message
            };

            const response = await request(app)
                .post('/notifications/send')
                .send(notificationData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });

    describe('GET /notifications/:id', () => {
        it('should get user notifications', async () => {
            const userId = new ObjectId().toString();

            // Создаем тестовые уведомления
            await notificationsCollection.insertMany([
                {
                    userId,
                    type: 'match_request',
                    title: 'Match 1',
                    message: 'Message 1',
                    read: false,
                    createdAt: new Date()
                },
                {
                    userId,
                    type: 'match_accepted',
                    title: 'Match 2',
                    message: 'Message 2',
                    read: false,
                    createdAt: new Date()
                }
            ]);

            const response = await request(app)
                .get(`/notifications/${userId}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
        });

        it('should return empty array for user with no notifications', async () => {
            const userId = new ObjectId().toString();

            const response = await request(app)
                .get(`/notifications/${userId}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });
    });

    describe('PUT /notifications/:id/read', () => {
        it('should mark notification as read', async () => {
            const notification = {
                userId: new ObjectId().toString(),
                type: 'new_message',
                title: 'New Message',
                message: 'You have a new message',
                read: false,
                createdAt: new Date()
            };

            const result = await notificationsCollection.insertOne(notification);
            const notificationId = result.insertedId.toString();

            const response = await request(app)
                .put(`/notifications/${notificationId}/read`)
                .expect(200);

            expect(response.body.success).toBe(true);

            // Проверяем что уведомление помечено как прочитанное
            const updatedNotification = await notificationsCollection.findOne({
                _id: new ObjectId(notificationId)
            });
            expect(updatedNotification.read).toBe(true);
        });

        it('should return 404 for non-existent notification', async () => {
            const notificationId = new ObjectId().toString();

            const response = await request(app)
                .put(`/notifications/${notificationId}/read`)
                .expect(404);

            expect(response.body.status).toBe('not found');
        });
    });

    describe('DELETE /notifications/:id', () => {
        it('should delete notification successfully', async () => {
            const notification = {
                userId: new ObjectId().toString(),
                type: 'match_declined',
                title: 'Match Declined',
                message: 'Your match was declined',
                read: false,
                createdAt: new Date()
            };

            const result = await notificationsCollection.insertOne(notification);
            const notificationId = result.insertedId.toString();

            await request(app)
                .delete(`/notifications/${notificationId}`)
                .expect(204);

            // Проверяем что уведомление удалено
            const deletedNotification = await notificationsCollection.findOne({
                _id: new ObjectId(notificationId)
            });
            expect(deletedNotification).toBeNull();
        });

        it('should return 404 for non-existent notification', async () => {
            const notificationId = new ObjectId().toString();

            const response = await request(app)
                .delete(`/notifications/${notificationId}`)
                .expect(404);

            expect(response.body.status).toBe('not found');
        });
    });
});
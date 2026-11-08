// profile-service/test/profile.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { ObjectId } from 'mongodb';
import mongo from '../src/database/mongo';
import app from '../src/app';

describe('Profile Service Integration Tests', () => {
    let profilesCollection: any;

    beforeAll(async () => {
        await mongo.connect();
        profilesCollection = mongo.db!.collection('profiles');
    });

    afterAll(async () => {
        await mongo.disconnect();
    });

    beforeEach(async () => {
        await profilesCollection.deleteMany({});
    });

    describe('POST /profiles', () => {
        it('should create a profile successfully', async () => {
            const profileData = {
                username: 'testuser',
                email: 'test@example.com',
                games: ['CS:GO', 'Valorant'],
                genres: ['FPS', 'Strategy'],
                playtimes: ['Evening', 'Night'],
                languages: ['English', 'Russian']
            };

            const response = await request(app)
                .post('/profiles')
                .send(profileData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.username).toBe(profileData.username);
            expect(response.body.email).toBe(profileData.email);
            expect(response.body.games).toEqual(profileData.games);
        });

        it('should fail with invalid email', async () => {
            const profileData = {
                username: 'testuser',
                email: 'invalid-email',
                games: ['CS:GO']
            };

            const response = await request(app)
                .post('/profiles')
                .send(profileData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });

        it('should fail with short username', async () => {
            const profileData = {
                username: 'ab',
                email: 'test@example.com'
            };

            const response = await request(app)
                .post('/profiles')
                .send(profileData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });

    describe('GET /profiles', () => {
        it('should return all profiles', async () => {
            await profilesCollection.insertMany([
                {
                    userId: new ObjectId(),
                    username: 'user1',
                    email: 'user1@example.com',
                    games: ['CS:GO'],
                    genres: ['FPS'],
                    playtimes: [],
                    languages: [],
                    isOnline: false,
                    createdAt: new Date()
                },
                {
                    userId: new ObjectId(),
                    username: 'user2',
                    email: 'user2@example.com',
                    games: ['Valorant'],
                    genres: ['FPS'],
                    playtimes: [],
                    languages: [],
                    isOnline: false,
                    createdAt: new Date()
                }
            ]);

            const response = await request(app)
                .get('/profiles')
                .expect(200);

            expect(response.body).toHaveLength(2);
        });
    });

    describe('GET /profiles/:id', () => {
        it('should return profile by id', async () => {
            const profile = {
                userId: new ObjectId(),
                username: 'testuser',
                email: 'test@example.com',
                games: ['CS:GO'],
                genres: ['FPS'],
                playtimes: [],
                languages: [],
                isOnline: false,
                createdAt: new Date()
            };

            const result = await profilesCollection.insertOne(profile);
            const profileId = result.insertedId.toString();

            const response = await request(app)
                .get(`/profiles/${profileId}`)
                .expect(200);

            expect(response.body.username).toBe(profile.username);
            expect(response.body.email).toBe(profile.email);
        });

        it('should return 404 for non-existent profile', async () => {
            const fakeId = new ObjectId().toString();

            await request(app)
                .get(`/profiles/${fakeId}`)
                .expect(404);
        });
    });

    describe('PUT /profiles/:id', () => {
        it('should update profile', async () => {
            const profile = {
                userId: new ObjectId(),
                username: 'testuser',
                email: 'test@example.com',
                games: ['CS:GO'],
                genres: ['FPS'],
                playtimes: [],
                languages: [],
                isOnline: false,
                createdAt: new Date()
            };

            const result = await profilesCollection.insertOne(profile);
            const profileId = result.insertedId.toString();

            const updateData = {
                username: 'updateduser',
                email: 'updated@example.com',
                games: ['Valorant', 'CS:GO']
            };

            const response = await request(app)
                .put(`/profiles/${profileId}`)
                .send(updateData)
                .expect(200);

            expect(response.body.username).toBe(updateData.username);
            expect(response.body.email).toBe(updateData.email);
        });
    });

    describe('PUT /profiles/:id/online', () => {
        it('should update online status', async () => {
            const profile = {
                userId: new ObjectId(),
                username: 'testuser',
                email: 'test@example.com',
                games: ['CS:GO'],
                genres: ['FPS'],
                playtimes: [],
                languages: [],
                isOnline: false,
                createdAt: new Date()
            };

            const result = await profilesCollection.insertOne(profile);
            const profileId = result.insertedId.toString();

            const response = await request(app)
                .put(`/profiles/${profileId}/online`)
                .send({ isOnline: true })
                .expect(200);

            expect(response.body.isOnline).toBe(true);
        });
    });

    describe('DELETE /profiles/:id', () => {
        it('should delete profile', async () => {
            const profile = {
                userId: new ObjectId(),
                username: 'testuser',
                email: 'test@example.com',
                games: ['CS:GO'],
                genres: ['FPS'],
                playtimes: [],
                languages: [],
                isOnline: false,
                createdAt: new Date()
            };

            const result = await profilesCollection.insertOne(profile);
            const profileId = result.insertedId.toString();

            await request(app)
                .delete(`/profiles/${profileId}`)
                .expect(204);

            const deletedProfile = await profilesCollection.findOne({
                _id: new ObjectId(profileId)
            });
            expect(deletedProfile).toBeNull();
        });
    });

    describe('GET /profiles/search', () => {
        it('should search profiles by username', async () => {
            await profilesCollection.insertMany([
                {
                    userId: new ObjectId(),
                    username: 'gamer123',
                    email: 'gamer@example.com',
                    games: ['CS:GO'],
                    genres: ['FPS'],
                    playtimes: [],
                    languages: [],
                    isOnline: false,
                    createdAt: new Date()
                },
                {
                    userId: new ObjectId(),
                    username: 'player456',
                    email: 'player@example.com',
                    games: ['Valorant'],
                    genres: ['FPS'],
                    playtimes: [],
                    languages: [],
                    isOnline: false,
                    createdAt: new Date()
                }
            ]);

            const response = await request(app)
                .get('/profiles/search?query=gamer')
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0].username).toBe('gamer123');
        });
    });
});
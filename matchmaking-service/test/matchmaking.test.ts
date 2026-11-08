// matchmaking-service/test/matchmaking.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { ObjectId } from 'mongodb';
import mongo from '../src/database/mongo';
import app from '../src/app';
import * as profileService from '../src/services/profile.service';

describe('Matchmaking Service Integration Tests', () => {
    let matchesCollection: any;

    beforeAll(async () => {
        await mongo.connect();
        matchesCollection = mongo.db!.collection('matches');
    });

    afterAll(async () => {
        await mongo.disconnect();
    });

    beforeEach(async () => {
        // Полная очистка коллекции
        await matchesCollection.deleteMany({});
        vi.clearAllMocks();
    });

    describe('POST /matchmaking/matches', () => {
        it('should create a match request successfully', async () => {
            const requesterProfileId = new ObjectId().toString();
            const targetProfileId = new ObjectId().toString();

            vi.spyOn(profileService.profileService, 'getById')
                .mockImplementation(async (id: string) => {
                    if (id === requesterProfileId) {
                        return {
                            _id: requesterProfileId,
                            userId: new ObjectId().toString(),
                            username: 'requester',
                            email: 'requester@example.com',
                            games: ['Counter-Strike 2'],
                            genres: ['FPS']
                        };
                    }
                    if (id === targetProfileId) {
                        return {
                            _id: targetProfileId,
                            userId: new ObjectId().toString(),
                            username: 'target',
                            email: 'target@example.com',
                            games: ['Counter-Strike 2'],
                            genres: ['FPS']
                        };
                    }
                    return null;
                });

            const matchData = {
                requesterProfileId,
                targetProfileId,
                game: 'Counter-Strike 2',
                message: 'Want to play competitive?'
            };

            const response = await request(app)
                .post('/matchmaking/matches')
                .send(matchData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.game).toBe(matchData.game);
            expect(response.body.status).toBe('pending');
        });

        it('should fail with non-existent requester profile', async () => {
            const requesterProfileId = new ObjectId().toString();
            const targetProfileId = new ObjectId().toString();

            vi.spyOn(profileService.profileService, 'getById')
                .mockImplementation(async (id: string) => {
                    if (id === requesterProfileId) {
                        return null;
                    }
                    if (id === targetProfileId) {
                        return {
                            _id: targetProfileId,
                            userId: new ObjectId().toString(),
                            username: 'target',
                            email: 'target@example.com',
                            games: ['CS:GO'],
                            genres: ['FPS']
                        };
                    }
                    return null;
                });

            const matchData = {
                requesterProfileId,
                targetProfileId,
                game: 'CS:GO'
            };

            const response = await request(app)
                .post('/matchmaking/matches')
                .send(matchData)
                .expect(404);

            expect(response.body.status).toBe('not found');
            expect(response.body.message).toContain('Requester profile not found');
        });

        it('should fail with non-existent target profile', async () => {
            const requesterProfileId = new ObjectId().toString();
            const targetProfileId = new ObjectId().toString();

            vi.spyOn(profileService.profileService, 'getById')
                .mockImplementation(async (id: string) => {
                    if (id === requesterProfileId) {
                        return {
                            _id: requesterProfileId,
                            userId: new ObjectId().toString(),
                            username: 'requester',
                            email: 'requester@example.com',
                            games: ['Valorant'],
                            genres: ['FPS']
                        };
                    }
                    if (id === targetProfileId) {
                        return null;
                    }
                    return null;
                });

            const matchData = {
                requesterProfileId,
                targetProfileId,
                game: 'Valorant'
            };

            const response = await request(app)
                .post('/matchmaking/matches')
                .send(matchData)
                .expect(404);

            expect(response.body.status).toBe('not found');
            expect(response.body.message).toContain('Target profile not found');
        });

        it('should fail with invalid requesterProfileId', async () => {
            const matchData = {
                requesterProfileId: 'invalid-id',
                targetProfileId: new ObjectId().toString(),
                game: 'CS:GO'
            };

            const response = await request(app)
                .post('/matchmaking/matches')
                .send(matchData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });

        it('should fail with missing game', async () => {
            const matchData = {
                requesterProfileId: new ObjectId().toString(),
                targetProfileId: new ObjectId().toString()
            };

            const response = await request(app)
                .post('/matchmaking/matches')
                .send(matchData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });

    describe('GET /matchmaking/matches/:id', () => {
        it('should get match by id', async () => {
            const match = {
                requesterProfileId: new ObjectId(),
                targetProfileId: new ObjectId(),
                game: 'Valorant',
                status: 'pending',
                createdAt: new Date()
            };

            const result = await matchesCollection.insertOne(match);
            const matchId = result.insertedId.toString();

            const response = await request(app)
                .get(`/matchmaking/matches/${matchId}`)
                .expect(200);

            expect(response.body._id).toBe(matchId);
            expect(response.body.game).toBe('Valorant');
        });

        it('should return 404 for non-existent match', async () => {
            const matchId = new ObjectId().toString();

            const response = await request(app)
                .get(`/matchmaking/matches/${matchId}`)
                .expect(404);

            expect(response.body.status).toBe('not found');
        });
    });

    describe('PUT /matchmaking/matches/:id/accept', () => {
        it('should accept a match', async () => {
            const match = {
                requesterProfileId: new ObjectId(),
                targetProfileId: new ObjectId(),
                game: 'Dota 2',
                status: 'pending',
                createdAt: new Date()
            };

            const result = await matchesCollection.insertOne(match);
            const matchId = result.insertedId.toString();

            const response = await request(app)
                .put(`/matchmaking/matches/${matchId}/accept`)
                .expect(200);
            console.log('Accept response:', JSON.stringify(response.body, null, 2));
            const matchData = response.body.value || response.body;

            expect(matchData.status).toBe('accepted');
            expect(matchData).toHaveProperty('acceptedAt');
        });

        it('should return 404 for non-existent match', async () => {
            const matchId = new ObjectId().toString();

            const response = await request(app)
                .put(`/matchmaking/matches/${matchId}/accept`)
                .expect(404);

            expect(response.body.status).toBe('not found');
        });
    });

    describe('PUT /matchmaking/matches/:id/decline', () => {
        it('should decline a match', async () => {
            const match = {
                requesterProfileId: new ObjectId(),
                targetProfileId: new ObjectId(),
                game: 'League of Legends',
                status: 'pending',
                createdAt: new Date()
            };

            const result = await matchesCollection.insertOne(match);
            const matchId = result.insertedId.toString();

            const response = await request(app)
                .put(`/matchmaking/matches/${matchId}/decline`)
                .expect(200);
            console.log('Decline response:', JSON.stringify(response.body, null, 2));

            const matchData = response.body.value || response.body;

            expect(matchData.status).toBe('declined');
            expect(matchData).toHaveProperty('declinedAt');
        });

        it('should return 404 for non-existent match', async () => {
            const matchId = new ObjectId().toString();

            const response = await request(app)
                .put(`/matchmaking/matches/${matchId}/decline`)
                .expect(404);

            expect(response.body.status).toBe('not found');
        });
    });

    describe('POST /matchmaking/find', () => {
        // Общий beforeEach для всех тестов в этом describe
        beforeEach(async () => {
            // Дополнительная очистка специально для этого блока тестов
            await matchesCollection.deleteMany({});
        });

        it('should find pending matches', async () => {
            await matchesCollection.insertMany([
                {
                    requesterProfileId: new ObjectId(),
                    targetProfileId: new ObjectId(),
                    game: 'CS:GO',
                    status: 'pending',
                    createdAt: new Date()
                },
                {
                    requesterProfileId: new ObjectId(),
                    targetProfileId: new ObjectId(),
                    game: 'Valorant',
                    status: 'accepted',
                    createdAt: new Date()
                },
                {
                    requesterProfileId: new ObjectId(),
                    targetProfileId: new ObjectId(),
                    game: 'Dota 2',
                    status: 'pending',
                    createdAt: new Date()
                }
            ]);

            const response = await request(app)
                .post('/matchmaking/find')
                .send({ page: 1, limit: 10 })
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
        });

        it('should return empty array when no matches found', async () => {
            const response = await request(app)
                .post('/matchmaking/find')
                .send({ page: 1, limit: 10 })
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });
    });
});
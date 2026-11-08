// auth-service/test/auth.test.ts
import {describe, it, expect, beforeEach} from 'vitest';
import request from 'supertest';
import {ObjectId} from 'mongodb';
import mongo from "../src/database/mongo";
import {app} from "../src/api/server";

describe('Auth API Integration Tests', () => {
    const usersCollection = mongo.db.collection('users');

    beforeEach(async () => {
        await usersCollection.deleteMany({});
    });

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('token');
            expect(response.body.username).toBe(userData.username);
            expect(response.body.email).toBe(userData.email);
            expect(response.body).not.toHaveProperty('password');
        });

        it('should fail with existing email', async () => {
            const userData = {
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            };

            await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });

        it('should fail with invalid email', async () => {
            const userData = {
                username: "testuser",
                email: "invalid-email",
                password: "password123"
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });

        it('should fail with short password', async () => {
            const userData = {
                username: "testuser",
                email: "test@example.com",
                password: "12345"
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.status).toBe('bad input');
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            const userData = {
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            };

            await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password
                })
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body.email).toBe(userData.email);
        });

        it('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: "nonexistent@example.com",
                    password: "wrongpassword"
                })
                .expect(401);

            expect(response.body.status).toBe('unauthorized');
        });
    });

    describe('GET /auth/profile', () => {
        it('should return user profile with valid token', async () => {
            const userData = {
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            };

            const registerResponse = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            const token = registerResponse.body.token;

            const response = await request(app)
                .get('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.username).toBe(userData.username);
            expect(response.body.email).toBe(userData.email);
        });

        it('should fail without token', async () => {
            const response = await request(app)
                .get('/auth/profile')
                .expect(401);

            expect(response.body.status).toBe('unauthorized');
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/auth/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.status).toBe('unauthorized');
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout successfully', async () => {
            const userData = {
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            };

            const registerResponse = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            const token = registerResponse.body.token;

            await request(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const profileResponse = await request(app)
                .get('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(401);

            expect(profileResponse.body.status).toBe('unauthorized');
        });
    });
});
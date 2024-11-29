import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createTestApp } from '../../test-server';
import { TestDataSource } from '../../../src/config/database.test';
import { User } from '../../../src/components/users/data-access/user.entity';
import bcrypt from 'bcrypt';

let app: any;
let testUser: User;
let authToken: string;

beforeAll(async () => {
    app = await createTestApp();
});

beforeEach(async () => {
    // Create test user
    const userRepository = TestDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    const user = userRepository.create({
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: true
    });
    testUser = await userRepository.save(user);

    // Get auth token
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@test.com',
            password: 'TestPass123!'
        });
    authToken = loginResponse.body.token;
});

describe('User API Tests', () => {
    describe('POST /api/users/register', () => {
        it('should create new user successfully', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'New User',
                    email: 'newuser@test.com',
                    password: 'NewPass123!'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('newuser@test.com');
            expect(response.body).not.toHaveProperty('password');
        });

        it('should reject duplicate email', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Another User',
                    email: 'test@test.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('already exists');
        });

        it('should validate name length', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'A',
                    email: 'newuser@test.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(400);
        });

        it('should validate email format', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'New User',
                    email: 'invalid-email',
                    password: 'Password123!'
                });

            expect(response.status).toBe(400);
        });

        it('should validate password strength', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'New User',
                    email: 'newuser@test.com',
                    password: 'weak'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get user by id', async () => {
            const response = await request(app)
                .get(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testUser.id);
            expect(response.body.email).toBe(testUser.email);
            expect(response.body).not.toHaveProperty('password');
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .get('/api/users/nonexistent-id')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .get(`/api/users/${testUser.id}`);

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user name', async () => {
            const response = await request(app)
                .put(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Updated Name'
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Updated Name');
        });

        it('should prevent email update', async () => {
            const response = await request(app)
                .put(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    email: 'newemail@test.com'
                });

            expect(response.status).toBe(400);
        });

        it('should validate name length on update', async () => {
            const response = await request(app)
                .put(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'A'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            // Verify user is deleted
            const getResponse = await request(app)
                .get(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(getResponse.status).toBe(404);
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .delete('/api/users/nonexistent-id')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUser.id}`);

            expect(response.status).toBe(401);
        });
    });
});
import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { User } from '../../../src/components/users/data-access/user.entity';
import { createTestApp } from '../../test-server';
import { TestHelper } from '../../helpers/auth.helper';

let app: any;
let testUser: User;
let authToken: string;

beforeAll(async () => {
    app = await createTestApp();
});

beforeEach(async () => {
      // Create test user
      testUser = await TestHelper.createTestUser('test@test.com');

      // Get auth token
      authToken = TestHelper.generateTestToken(testUser);
});

describe('Auth API Tests', () => {
    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', 'test@test.com');
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should reject invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'WrongPassword123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials-2');
        });

        it('should reject non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials-1');
        });

        it('should validate email format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(400);
        });

        it('should require password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Authentication Middleware', () => {
        let authToken: string;

        beforeEach(async () => {
            // Get auth token
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'TestPass123!'
                });
            authToken = loginResponse.body.token;
        });

        it('should access protected route with valid token', async () => {
            const response = await request(app)
                .get(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testUser.id);
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get(`/api/users/${testUser.id}`);

            expect(response.status).toBe(401);
        });

        it('should reject invalid token format', async () => {
            const response = await request(app)
                .get(`/api/users/${testUser.id}`)
                .set('Authorization', 'InvalidFormat');

            expect(response.status).toBe(401);
        });

        it('should reject expired token', async () => {
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.N7TqLhxz_6fHAGTXIoJ3FWn9YXIwK4B9H-MGExR7Oq8';

            const response = await request(app)
                .get(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(response.status).toBe(401);
        });
    });
});

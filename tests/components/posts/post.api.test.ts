import { describe, expect, it, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createTestApp } from '../../test-server';
import { TestDataSource } from '../../../src/config/database.test';
import { TestHelper } from '../../helpers/auth.helper';
import { User } from '../../../src/components/users/data-access/user.entity';
import { Post } from '../../../src/components/posts/data-access/post.entity';

describe('Post API Tests', () => {
    let app: any;
    let testUser: User;
    let authToken: string;
    let testPost: Post;

    beforeEach(async () => {
        app = await createTestApp();

        // Create test user
        const userRepository = TestDataSource.getRepository(User);
        testUser = await TestHelper.createTestUser();
        
        // Get auth token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'TestPass123!'
            });
        
        authToken = loginResponse.body.token;

        // Create test post
        const postRepository = TestDataSource.getRepository(Post);
        testPost = await postRepository.save({
            title: 'Test Post',
            content: 'Test Content',
            published: true,
            userId: testUser.id
        });
    });

    describe('POST /api/posts', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'New Post',
                    content: 'New Content',
                    published: true
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('New Post');
            expect(response.body.userId).toBe(testUser.id);
        });

        it('should validate post input', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: '', // Invalid title
                    content: 'Content'
                });

            expect(response.status).toBe(400);
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .post('/api/posts')
                .send({
                    title: 'New Post',
                    content: 'Content'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/posts', () => {
        it('should get all published posts', async () => {
            const response = await request(app)
                .get('/api/posts');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('id');
        });

        it('should filter by published status', async () => {
            const response = await request(app)
                .get('/api/posts?published=true');

            expect(response.status).toBe(200);
            expect(response.body.every((post: Post) => post.published)).toBe(true);
        });
    });

    describe('GET /api/posts/:id', () => {
        it('should get post by id', async () => {
            const response = await request(app)
                .get(`/api/posts/${testPost.id}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testPost.id);
        });

        it('should return 404 for non-existent post', async () => {
            const response = await request(app)
                .get('/api/posts/non-existent-id');

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/posts/:id', () => {
        it('should update post', async () => {
            const response = await request(app)
                .put(`/api/posts/${testPost.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Title'
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
        });

        it('should prevent updating post by non-owner', async () => {
            // Create another user
            const anotherUser = await TestHelper.createTestUser('another@test.com');
            const anotherToken = await TestHelper.generateTestToken(anotherUser);

            const response = await request(app)
                .put(`/api/posts/${testPost.id}`)
                .set('Authorization', `Bearer ${anotherToken}`)
                .send({
                    title: 'Updated Title'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/posts/:id', () => {
        it('should delete post', async () => {
            const response = await request(app)
                .delete(`/api/posts/${testPost.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            // Verify deletion
            const getResponse = await request(app)
                .get(`/api/posts/${testPost.id}`);
            expect(getResponse.status).toBe(404);
        });

        it('should prevent deleting post by non-owner', async () => {
            // Create another user
            const anotherUser = await TestHelper.createTestUser('another@test.com');
            const anotherToken = await TestHelper.generateTestToken(anotherUser);

            const response = await request(app)
                .delete(`/api/posts/${testPost.id}`)
                .set('Authorization', `Bearer ${anotherToken}`);

            expect(response.status).toBe(403);
        });
    });
});
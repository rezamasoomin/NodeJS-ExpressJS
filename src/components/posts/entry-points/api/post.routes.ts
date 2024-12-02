import { Router } from 'express';
import { PostController } from './post.controller';
import { PostService } from '../../domain/post.service';
import { PostRepository } from '../../data-access/post.repository';
import { AuthMiddleware } from '../../../auth/entry-points/api/auth.middleware';
import { DataSource } from 'typeorm';

export const createPostRouter = (dataSource: DataSource, authMiddleware: AuthMiddleware) => {
    const router = Router();
    const postRepository = new PostRepository(dataSource);
    const postService = new PostService(postRepository);
    const postController = new PostController(postService);

    // Public routes
    router.get('/', postController.getAllPosts);
    router.get('/:id', postController.getPost);

    // Protected routes
    router.post('/', authMiddleware.authenticate, postController.createPost);
    router.put('/:id', authMiddleware.authenticate, postController.updatePost);
    router.delete('/:id', authMiddleware.authenticate, postController.deletePost);

    return router;
};
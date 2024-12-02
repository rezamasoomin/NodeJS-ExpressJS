import express from 'express';
import { createUserRouter } from '../src/components/users/entry-points/api/user.routes';
import { createAuthRouter } from '../src/components/auth/entry-points/api/auth.routes';
import { createPostRouter } from '../src/components/posts/entry-points/api/post.routes';
import { AuthMiddleware } from '../src/components/auth/entry-points/api/auth.middleware';
import { AuthService } from '../src/components/auth/domain/auth.service';
import { UserRepository } from '../src/components/users/data-access/user.repository';
import { errorHandler } from '../src/libraries/error-handler';
import { TestDataSource } from '../src/config/database.test';

export const createTestApp = async () => {
    const app = express();
    app.use(express.json());

    const userRepository = new UserRepository(TestDataSource);
    const authService = new AuthService(userRepository);
    const authMiddleware = new AuthMiddleware(authService);

    app.use('/api/auth', createAuthRouter(TestDataSource));
    app.use('/api/users', createUserRouter(TestDataSource, authMiddleware));
    app.use('/api/posts', createPostRouter(TestDataSource, authMiddleware));
    app.use(errorHandler);

    return app;
};

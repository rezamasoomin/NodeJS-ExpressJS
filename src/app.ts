import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './libraries/error-handler';
import { createAuthRouter } from './components/auth/entry-points/api/auth.routes';
import { createUserRouter } from './components/users/entry-points/api/user.routes';
import { createPostRouter } from './components/posts/entry-points/api/post.routes';
import { AuthMiddleware } from './components/auth/entry-points/api/auth.middleware';
import AppDataSource from './config/database';
import {TestDataSource} from './config/database.test';
import { AuthService } from './components/auth/domain/auth.service';
import { UserRepository } from './components/users/data-access/user.repository';

export async function createApp() {
    const app = express();

    // Security & utility middleware
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json());

    // Initialize auth middleware
    const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
    const authMiddleware = new AuthMiddleware(new AuthService(new UserRepository(dataSource)));

    // Routes
    app.use('/api/auth', createAuthRouter(dataSource));
    app.use('/api/users', createUserRouter(dataSource, authMiddleware));
    app.use('/api/posts', createPostRouter(dataSource, authMiddleware));

    // Error handling
    app.use(errorHandler);

    return app;
}
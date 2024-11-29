import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './libraries/error-handler';
import logger from './libraries/logger';
import { createUserRouter } from './components/users/entry-points/api/user.routes';
import { createAuthRouter } from './components/auth/entry-points/api/auth.routes';
import { AuthMiddleware } from './components/auth/entry-points/api/auth.middleware';
import { AuthService } from './components/auth/domain/auth.service';
import { UserRepository } from './components/users/data-access/user.repository';
import { apiLimiter } from './libraries/rate-limiter';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Global rate limiting
app.use('/api/', apiLimiter);

// Initialize Auth Middleware
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authMiddleware = new AuthMiddleware(authService);

// Routes
app.use('/api/auth', createAuthRouter());
app.use('/api/users', createUserRouter(authMiddleware));

// Error handling
app.use(errorHandler);

// Database initialization
AppDataSource.initialize()
    .then(() => {
        logger.info('Database has been initialized!');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Error during Data Source initialization:', error);
    });

export default app;
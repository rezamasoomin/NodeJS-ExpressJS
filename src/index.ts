import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './libraries/error-handler';
import logger from './libraries/logger';
import userRoutes from './components/users/entry-points/api/user.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use('/api/users', userRoutes);
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
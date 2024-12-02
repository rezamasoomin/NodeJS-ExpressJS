import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../../domain/auth.service';
import { UserRepository } from '../../../users/data-access/user.repository';
import { authLimiter } from '../../../../libraries/rate-limiter';
import { sanitizeInput } from '../../../../libraries/sanitization';
import { validateDto } from '../../../../libraries/validation';
import { LoginDto } from '../../domain/dtos/auth.dto';
import { validateLogin } from './auth.validation';
import { DataSource } from 'typeorm';

export const createAuthRouter = (dataSource: DataSource) => {
    const router = Router();
    const userRepository = new UserRepository(dataSource);
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    router.post(
        '/login',
        authLimiter,
        sanitizeInput,
        validateLogin,
        validateDto(LoginDto),
        authController.login
    );

    return router;
};

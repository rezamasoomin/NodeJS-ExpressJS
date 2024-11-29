import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../../domain/auth.service';
import { UserRepository } from '../../../users/data-access/user.repository';
import { authLimiter } from '../../../../libraries/rate-limiter';
import { sanitizeInput } from '../../../../libraries/sanitization';
import { validateDto } from '../../../../libraries/validation';
import { LoginDto } from '../../domain/dtos/auth.dto';

export const createAuthRouter = () => {
    const router = Router();
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    router.post(
        '/login',
        authLimiter,
        sanitizeInput,
        validateDto(LoginDto),
        authController.login
    );

    return router;
};
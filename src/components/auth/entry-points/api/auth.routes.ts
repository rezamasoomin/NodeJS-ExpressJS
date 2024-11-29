import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../../domain/auth.service';
import { UserRepository } from '../../../users/data-access/user.repository';
import { validateLogin } from './auth.validation';

export const createAuthRouter = () => {
    const router = Router();
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    router.post(
        '/login',
        validateLogin,
        authController.login
    );

    return router;
};
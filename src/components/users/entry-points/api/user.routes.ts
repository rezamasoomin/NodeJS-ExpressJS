import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from '../../domain/user.service';
import { UserRepository } from '../../data-access/user.repository';
import { AuthMiddleware } from '../../../auth/entry-points/api/auth.middleware';
import { validateDto } from '../../../../libraries/validation';
import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user.dto';
import { apiLimiter } from '../../../../libraries/rate-limiter';
import { sanitizeInput } from '../../../../libraries/sanitization';

export const createUserRouter = (authMiddleware: AuthMiddleware) => {
    const router = Router();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    // Apply rate limiting to all user routes
    router.use(apiLimiter);

    // Public routes
    router.post(
        '/register',
        sanitizeInput,
        validateDto(CreateUserDto),
        userController.createUser
    );

    // Protected routes
    router.get(
        '/:id',
        authMiddleware.authenticate,
        userController.getUser
    );

    router.put(
        '/:id',
        authMiddleware.authenticate,
        sanitizeInput,
        validateDto(UpdateUserDto),
        userController.updateUser
    );

    router.delete(
        '/:id',
        authMiddleware.authenticate,
        userController.deleteUser
    );

    return router;
};
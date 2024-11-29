import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from '../../domain/user.service';
import { UserRepository } from '../../data-access/user.repository';
import { AuthMiddleware } from '../../../auth/entry-points/api/auth.middleware';
import { validateUserCreation } from './user.validation';

export const createUserRouter = (authMiddleware: AuthMiddleware) => {
    const router = Router();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    // Public routes
    router.post(
        '/register', 
        validateUserCreation,
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
        userController.updateUser
    );

    router.delete(
        '/:id',
        authMiddleware.authenticate,
        userController.deleteUser
    );

    return router;
};
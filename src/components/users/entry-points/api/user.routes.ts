import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from '../../domain/user.service';
import { UserRepository } from '../../data-access/user.repository';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
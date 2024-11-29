import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../domain/user.service';
import { UserSchema } from '../../domain/user';
import logger from '../../../../libraries/logger';

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = UserSchema.parse(req.body);
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      logger.error(error, 'Error in createUser controller');
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      logger.error(error, 'Error in getUser controller');
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      logger.error(error, 'Error in updateUser controller');
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(error, 'Error in deleteUser controller');
      next(error);
    }
  };
}
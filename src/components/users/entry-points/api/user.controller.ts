import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../domain/user.service';
import { UserSchema } from '../../domain/user';
import logger from '../../../../libraries/logger';
import { ZodError } from 'zod';

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Attempting to create user with data:', { ...req.body, password: '[REDACTED]' });
      
      const userData = UserSchema.parse(req.body);
      const user = await this.userService.createUser(userData);
      
      logger.info('User created successfully');
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error in createUser:', error.errors);
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.errors
        });
      }
      
      logger.error('Error in createUser controller:', error);
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      logger.error('Error in getUser controller:', error);
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      logger.error('Error in updateUser controller:', error);
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error in deleteUser controller:', error);
      next(error);
    }
  };
}
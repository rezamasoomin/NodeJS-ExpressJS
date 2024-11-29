import bcrypt from 'bcrypt';
import { User, UserDTO, IUserRepository } from './user';
import { AppError } from '../../../libraries/error-handler';
import logger from '../../../libraries/logger';

export class UserService {
  constructor(private userRepository: IUserRepository) { }

  async createUser(userData: User): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userWithHashedPassword = { ...userData, password: hashedPassword };

    try {
      const newUser = await this.userRepository.create(userWithHashedPassword);
      logger.info({ userId: newUser.id }, 'User created successfully');
      return newUser;
    } catch (error) {
      logger.error(error, 'Error creating user');
      throw new AppError(500, 'Error creating user');
    }
  }

  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<UserDTO> {
    try {
      // Prevent email updates
      if (updateData.email) {
        throw new AppError(400, 'Email cannot be updated');
      }

      // Validate name length if provided
      if (updateData.name && (updateData.name.length < 2 || updateData.name.length > 100)) {
        throw new AppError(400, 'Name must be between 2 and 100 characters');
      }

      const user = await this.userRepository.update(id, updateData);
      logger.info({ userId: id }, 'User updated successfully');
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(error, 'Error updating user');
      throw new AppError(500, 'Error updating user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
        await this.userRepository.delete(id);
        logger.info({ userId: id }, 'User deleted successfully');
    } catch (error) {
        if (error instanceof AppError) {
            throw error; // Rethrow AppError (including 404)
        }
        logger.error(error, 'Error deleting user');
        throw new AppError(500, 'Error deleting user');
    }
}
}
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IUserRepository } from '../domain/user';
import { AppDataSource } from '../../../config/database';
import { UserDTO } from '../domain/user';
import { AppError } from '../../../libraries/error-handler';

export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async create(userData: Partial<User>): Promise<UserDTO> {
        const user = this.repository.create(userData);
        const savedUser = await this.repository.save(user);
        const { password, ...userDto } = savedUser;
        return userDto as UserDTO;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ 
            where: { email },
            select: ['id', 'email', 'name', 'password', 'createdAt', 'updatedAt', 'isActive'] 
        });
    }

    async findById(id: string): Promise<UserDTO | null> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) return null;
        const { password, ...userDto } = user;
        return userDto as UserDTO;
    }

    async update(id: string, userData: Partial<User>): Promise<UserDTO> {
        const updateResult = await this.repository.update(id, userData);
        if (!updateResult.affected) {
            throw new AppError(404, 'User not found');
        }
        const updatedUser = await this.repository.findOne({ where: { id } });
        const { password, ...userDto } = updatedUser as User;
        return userDto as UserDTO;
    }

    async delete(id: string): Promise<void> {
        const result = await this.repository.delete(id);
        if (!result.affected) {
            throw new AppError(404, 'User not found');
        }
    }
}
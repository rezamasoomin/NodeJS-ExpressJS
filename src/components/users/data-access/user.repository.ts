import { Repository, DataSource, EntityNotFoundError } from 'typeorm';
import { User } from './user.entity';
import { IUserRepository } from '../domain/user';
import { UserDTO } from '../domain/user';
import { AppError } from '../../../libraries/error-handler';

export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(User);
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

    async delete(id: string): Promise<void> {
        try {
            const user = await this.repository.findOneOrFail({ where: { id } });
            await this.repository.remove(user);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new AppError(404, 'User not found');
            }
            throw error;
        }
    }

    async update(id: string, userData: Partial<User>): Promise<UserDTO> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) {
            throw new AppError(404, 'User not found');
        }

        const updatedUser = await this.repository.save({
            ...user,
            ...userData
        });

        const { password, ...userDto } = updatedUser;
        return userDto as UserDTO;
    }
}
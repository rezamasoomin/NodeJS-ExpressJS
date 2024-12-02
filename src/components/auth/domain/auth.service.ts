import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../users/domain/user';
import { LoginCredentials, AuthTokenPayload, LoginResponse, IAuthService } from './auth.types';
import { AppError } from '../../../libraries/error-handler';
import { User } from '../../users/data-access/user.entity';

export class AuthService implements IAuthService {
    constructor(
        private userRepository: IUserRepository,
        private jwtSecret: string = process.env.JWT_SECRET || 'your-secret-key'
    ) {}

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new AppError(401, 'Invalid credentials-1');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials-2');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            this.jwtSecret,
            { expiresIn: '24h' }
        );

        // Create a new object without the password
        const { password, ...userWithoutPassword } = user as User;

        return {
            token,
            user: userWithoutPassword
        };
    }

    async verifyToken(token: string): Promise<AuthTokenPayload> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
            return decoded;
        } catch (error) {
            throw new AppError(401, 'Invalid or expired token');
        }
    }
}
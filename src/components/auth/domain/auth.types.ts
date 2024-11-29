import { User } from '../../users/data-access/user.entity';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokenPayload {
    userId: string;
    email: string;
}

export type UserResponse = Omit<User, 'password'>;

export interface LoginResponse {
    token: string;
    user: UserResponse;
}

export interface IAuthService {
    login(credentials: LoginCredentials): Promise<LoginResponse>;
    verifyToken(token: string): Promise<AuthTokenPayload>;
}
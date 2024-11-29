import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../domain/auth.service';
import { AppError } from '../../../../libraries/error-handler';
import logger from '../../../../libraries/logger';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export class AuthMiddleware {
    constructor(private authService: AuthService) {}

    authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                throw new AppError(401, 'Authorization header missing or invalid');
            }

            const token = authHeader.split(' ')[1];
            const decoded = await this.authService.verifyToken(token);
            
            req.user = decoded;
            next();
        } catch (error) {
            next(new AppError(401, 'Authentication failed'));
        }
    };
}
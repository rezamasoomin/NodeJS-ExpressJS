import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../../domain/auth.service';
import logger from '../../../../libraries/logger';

export class AuthController {
    constructor(private authService: AuthService) {}

    validateLogin = [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isString().notEmpty().withMessage('Password is required'),
    ];

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { token, user } = await this.authService.login(req.body);
            res.json({ token, user });
        } catch (error) {
            logger.error(error, 'Login error');
            next(error);
        }
    };
}
import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../error-handler';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    handler: (req: Request, res: Response, next: NextFunction) => {
        next(new AppError(429, 'Too many requests from this IP, please try again later'));
    }
});

// More strict limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login requests per hour
    message: 'Too many login attempts, please try again later',
    handler: (req: Request, res: Response, next: NextFunction) => {
        next(new AppError(429, 'Too many login attempts, please try again later'));
    }
});
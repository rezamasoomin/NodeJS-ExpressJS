import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../../libraries/error-handler';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const validateLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await loginSchema.parseAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new AppError(400, error.errors[0].message));
        } else {
            next(error);
        }
    }
};
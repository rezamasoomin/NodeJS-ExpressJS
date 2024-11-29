import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../../libraries/error-handler';

const userCreationSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100)
});

export const validateUserCreation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await userCreationSchema.parseAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new AppError(400, error.errors[0].message));
        } else {
            next(error);
        }
    }
};
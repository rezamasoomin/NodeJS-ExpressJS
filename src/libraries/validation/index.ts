import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error-handler';

export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToClass(dtoClass, req.body);
        const errors = await validate(dtoObj);

        if (errors.length > 0) {
            const errorMessages = errors.map(error => 
                Object.values(error.constraints || {})
            ).flat();
            
            // Updated to match AppError constructor
            next(new AppError(400, `Validation failed: ${errorMessages.join(', ')}`));
        } else {
            req.body = dtoObj;
            next();
        }
    };
}
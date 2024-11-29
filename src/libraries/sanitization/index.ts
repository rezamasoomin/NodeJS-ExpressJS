import { Request, Response, NextFunction } from 'express';
import { escape } from 'validator';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = escape(req.body[key]);
            }
        }
    }
    next();
}
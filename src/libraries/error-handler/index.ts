import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: err,
    path: req.path,
    method: req.method
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Default error
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';

  return res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
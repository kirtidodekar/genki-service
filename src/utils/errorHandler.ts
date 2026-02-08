import { Response, Request, NextFunction } from 'express';
import * as winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`[${req.method}] ${req.path} >> ${statusCode}: ${message}`);

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export { logger };
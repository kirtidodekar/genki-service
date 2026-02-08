import { Response, Request, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
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
) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`[${req.method}] ${req.path} >> ${statusCode}: ${message}`);

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : message,
    });
};

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export { logger };

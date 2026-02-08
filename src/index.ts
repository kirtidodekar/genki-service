import app from './app.js';
import { logger } from './utils/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`🚀 AI Waste Marketplace Backend running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    if (process.env.DEV_MODE === 'true') {
        logger.info('🛠️ DEV_MODE is active: AI responses will be mocked.');
    }
});

// Handling Uncaught Exceptions
process.on('uncaughtException', (err: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
    process.exit(1);
});

// Handling Unhandled Rejections
process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});

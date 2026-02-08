import app from './app.js';
import { logger } from './utils/errorHandler.js';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// ONLY run app.listen if we are NOT on Vercel (local development)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        logger.info(`🚀 AI Waste Marketplace Backend running on port ${PORT}`);
        if (process.env.DEV_MODE === 'true') {
            logger.info('🛠️ DEV_MODE is active: AI responses will be mocked.');
        }
    });
}

// Handling Unhandled Rejections - simplified for Serverless
process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥', err);
});

process.on('uncaughtException', (err: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥', err);
});

// Vercel needs the app as a default export to handle the incoming requests
export default app;
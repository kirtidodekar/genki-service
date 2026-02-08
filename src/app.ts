import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysis.routes.js';
import { errorHandler } from './utils/errorHandler.js';
import { DatabaseService } from './services/db.service.js';

dotenv.config();

// Initialize Database
DatabaseService.initialize();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/analysis', analysisRoutes);

// Health Check
app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;

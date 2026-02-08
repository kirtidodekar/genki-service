import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import analysisRoutes from './routes/analysis.routes.js';
import { errorHandler } from './utils/errorHandler.js';
import { DatabaseService } from './services/db.service.js';

dotenv.config();

// Initialize Database
DatabaseService.initialize();

const app: Application = express();

const allowedOrigins = [
    'https://agricycle-connect.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// INCREASE LIMIT: Images in Base64 are large.
// Adding 10mb limit to prevent "Payload Too Large" errors.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/analysis', analysisRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
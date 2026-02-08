import { Request, Response } from 'express';
import { catchAsync, AppError, logger } from '../utils/errorHandler.js';
import { GenkitService } from '../services/genkit.service.js';
import { DatabaseService } from '../services/db.service.js';
import { AnalysisRequest } from '../types/analysis.types.js';

export class AnalysisController {
    /**
     * Main endpoint for waste analysis.
     * Handles image upload and calls AI service.
     */
    static analyzeWaste = catchAsync(async (req: Request, res: Response) => {
        const { location, quantity } = req.body;
        const file = req.file;

        // Validation
        if (!location || !quantity) {
            throw new AppError('Location and quantity are required', 400);
        }

        if (!file) {
            throw new AppError('An image file is required for analysis', 400);
        }

        logger.info(`Processing waste analysis request for location: ${location}`);

        const analysisRequest: AnalysisRequest = {
            location,
            quantity,
            imageBuffer: file.buffer,
            mimeType: file.mimetype,
        };

        const analysisResult = await GenkitService.analyzeWaste(analysisRequest);

        // Persist analysis (Background)
        const analysisId = `analysis_${Date.now()}`;
        DatabaseService.saveAnalysis(analysisId, {
            ...analysisRequest,
            imageBuffer: undefined, // Don't store large buffer in DB for now
            result: analysisResult
        });

        res.status(200).json({
            status: 'success',
            data: analysisResult,
        });
    });
}

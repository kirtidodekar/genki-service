import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

/**
 * @route POST /api/analysis/waste
 * @desc Analyze agricultural waste image + metadata
 * @access Public
 */
router.post(
    '/waste',
    upload.single('image'),
    AnalysisController.analyzeWaste
);

export default router;

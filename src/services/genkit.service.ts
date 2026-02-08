import { genkit } from 'genkit';
import { googleAI, gemini15Pro } from '@genkit-ai/googleai';
import { AnalysisRequest, AnalysisResponse, AnalysisResponseSchema } from '../types/analysis.types.js';
import { buildWasteAnalysisPrompt } from '../utils/aiPromptBuilder.js';
import { AppError, logger } from '../utils/errorHandler.js';
import { PricingService } from './pricing.service.js';
import dotenv from 'dotenv';

dotenv.config();

const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
});

export class GenkitService {
    /**
     * Performs AI-powered waste analysis using Gemini 1.5 Pro via Genkit.
     */
    static async analyzeWaste(data: AnalysisRequest): Promise<AnalysisResponse> {
        if (process.env.DEV_MODE === 'true') {
            logger.info('DEV_MODE enabled: Returning mock AI response');
            return this.getMockResponse();
        }

        try {
            const prompt = buildWasteAnalysisPrompt(data);

            const mediaParts = data.imageBuffer ? [
                {
                    inlineData: {
                        data: data.imageBuffer.toString('base64'),
                        mimeType: data.mimeType || 'image/jpeg',
                    },
                },
            ] : [];

            const result = await ai.generate({
                model: gemini15Pro,
                prompt: prompt,
                media: mediaParts,
                output: {
                    schema: AnalysisResponseSchema,
                },
            });

            const response = result.output();
            if (!response) {
                throw new AppError('AI failed to provide a valid response', 502);
            }

            return response as AnalysisResponse;

        } catch (error: any) {
            logger.error('Genkit/Gemini Analysis Error:', error);

            // Detect specific AI errors to avoid retries if quota/credits are issues
            const errorMessage = error.message?.toLowerCase() || '';
            const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('429');
            const isBillingError = errorMessage.includes('billing') || errorMessage.includes('credit');

            if (isQuotaError || isBillingError) {
                logger.warn('AI Credit/Quota issue detected. Falling back to rule-based pricing.');
                return PricingService.getFallbackAnalysis(data.location, data.quantity);
            }

            // Generic fallback for other errors
            return PricingService.getFallbackAnalysis(data.location, data.quantity);
        }
    }

    private static getMockResponse(): AnalysisResponse {
        return {
            wasteType: "Rice Husk (MOCK)",
            qualityGrade: "High",
            moistureLevel: "Low",
            estimatedPriceMin: 2500,
            estimatedPriceMax: 3200,
            recommendedBuyers: ["Bio-Tech Energy", "Local Animal Feed Mills"],
            usageApplications: ["Biofuel feedstock", "Cattle bedding", "Insulation material"],
            reasoning: "Mock data: High quality rice husk observed with very low moisture content. Market demand is currently steady in your region."
        };
    }
}

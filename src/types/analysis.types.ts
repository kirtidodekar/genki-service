import { z } from 'zod';

export const WasteQualitySchema = z.enum(['High', 'Medium', 'Low']);
export const MoistureLevelSchema = z.enum(['Low', 'Medium', 'High']);

export const AnalysisResponseSchema = z.object({
    wasteType: z.string(),
    qualityGrade: WasteQualitySchema,
    moistureLevel: MoistureLevelSchema,
    estimatedPriceMin: z.number(),
    estimatedPriceMax: z.number(),
    recommendedBuyers: z.array(z.string()),
    usageApplications: z.array(z.string()),
    reasoning: z.string(),
});

export type WasteQuality = z.infer<typeof WasteQualitySchema>;
export type MoistureLevel = z.infer<typeof MoistureLevelSchema>;
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

export interface AnalysisRequest {
    location: string;
    quantity: string;
    imageBuffer?: Buffer;
    mimeType?: string;
}

export interface PricingRule {
    type: string;
    minPrice: number;
    maxPrice: number;
    applications: string[];
    buyers: string[];
}

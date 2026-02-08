import { AnalysisResponse, PricingRule } from '../types/analysis.types.js';

const FALLBACK_PRICING_RULES: PricingRule[] = [
    {
        type: 'Rice Husk',
        minPrice: 2000,
        maxPrice: 3500,
        applications: ['Biofuel', 'Bedding', 'Construction'],
        buyers: ['Power Plants', 'Brick Kilns'],
    },
    {
        type: 'Wheat Straw',
        minPrice: 1500,
        maxPrice: 3000,
        applications: ['Animal Feed', 'Paper Pulp', 'Mulching'],
        buyers: ['Dairy Farmers', 'Paper Mills'],
    },
    {
        type: 'Sugarcane Bagasse',
        minPrice: 1200,
        maxPrice: 2500,
        applications: ['Energy production', 'Bio-packaging'],
        buyers: ['Sugar Mills', 'Eco-packaging Firms'],
    },
];

export class PricingService {
    static getFallbackAnalysis(location: string, quantity: string): AnalysisResponse {
        // Simple logic to return a generic "Mixed Farm Waste" response when AI fails
        const defaultRule = FALLBACK_PRICING_RULES[0];

        return {
            wasteType: 'Mixed Agricultural Waste (Fallback)',
            qualityGrade: 'Medium',
            moistureLevel: 'Medium',
            estimatedPriceMin: 1000,
            estimatedPriceMax: 2000,
            recommendedBuyers: ['Local Composting Units', 'Biogas Plants'],
            usageApplications: ['Organic Fertilizer', 'Energy Recovery'],
            reasoning: 'AI analysis unavailable. Returning baseline pricing for mixed organic waste based on typical market rates.',
        };
    }

    static getRuleBasedPricing(type: string): PricingRule | undefined {
        return FALLBACK_PRICING_RULES.find(r =>
            type.toLowerCase().includes(r.type.toLowerCase())
        );
    }
}

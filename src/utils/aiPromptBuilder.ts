import { AnalysisRequest } from '../types/analysis.types.js';

export const buildWasteAnalysisPrompt = (data: AnalysisRequest): string => {
    return `
    Analyze the provided agricultural waste image and metadata.
    
    COLTEXT:
    - Location: ${data.location}
    - Quantity: ${data.quantity}

    TASKS:
    1. Identify the specific type of agricultural waste (e.g., Rice Husk, Wheat Straw, Sugarcane Bagasse, Corn Cobs).
    2. Assess the quality grade (High, Medium, Low) based on visual appearance.
    3. Estimate moisture level (Low, Medium, High).
    4. Suggest a fair, ethical, and non-exploitative market price range (Min and Max) in local currency (estimate based on global averages if local is unknown, but keep farmer-first).
    5. Recommend buyer categories who would be interested (e.g., Biofuel Plants, Paper Mills, Composting Units).
    6. Identify common usage applications for this specific waste.

    STRICT RULES:
    - Respond ONLY with a valid JSON object.
    - No markdown, no "json" tags, no conversational text.
    - Schema:
      {
        "wasteType": "string",
        "qualityGrade": "High | Medium | Low",
        "moistureLevel": "Low | Medium | High",
        "estimatedPriceMin": number,
        "estimatedPriceMax": number,
        "recommendedBuyers": string[],
        "usageApplications": string[],
        "reasoning": "string (brief explanation of the quality and price)"
      }
  `;
};

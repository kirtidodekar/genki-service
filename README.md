# Agri-Waste Marketplace Backend (AI-Powered)

This is a production-ready backend service that uses Gemini 1.5 Pro and Firebase Genkit to analyze agricultural waste and provide fair market pricing suggestions for farmers.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Gemini API enabled
- Firebase Project (optional, for Firestore)

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Architecture

- **Firebase Genkit**: Orchestrates the AI flow.
- **Gemini 1.5 Pro**: Vision-capable AI for waste analysis.
- **Express.js**: Fast, unopinionated web framework.
- **Firestore**: Scalable NoSQL database with **In-memory fallback** for local dev/credit issues.
- **Zod**: Runtime schema validation for AI outputs.

## 📡 API Endpoints

### Waste Analysis
`POST /api/analysis/waste`
- **Body (Multipart/Form-Data)**:
  - `image`: The waste image file.
  - `location`: String (e.g., "Punjab, India").
  - `quantity`: String (e.g., "500kg").
- **Response**: Returns the AI-generated analysis JSON.

## 🛡️ Error Handling & AI Fallback
The system is built to be "Farmer-First". If the AI service is unavailable (quota, credits, or network):
1. The error is intercepted by `GenkitService`.
2. A rule-based fallback response is generated from `PricingService`.
3. The API always returns a valid, helpful price estimate to the farmer.

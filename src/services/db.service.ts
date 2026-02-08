import admin from 'firebase-admin';
import { logger } from '../utils/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

// In-memory fallback store
const memoryStore: Record<string, any> = {};

export class DatabaseService {
    private static db: admin.firestore.Firestore | null = null;
    private static useMemoryFallback = false;

    static initialize() {
        try {
            if (process.env.FIREBASE_PROJECT_ID && !admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
                this.db = admin.firestore();
                logger.info('✅ Firestore initialized successfully.');
            } else {
                throw new Error('Missing Firebase credentials');
            }
        } catch (error) {
            logger.warn('⚠️ Firestore initialization failed. Falling back to in-memory storage.');
            this.useMemoryFallback = true;
        }
    }

    static async saveAnalysis(id: string, data: any) {
        if (this.useMemoryFallback || !this.db) {
            memoryStore[id] = { ...data, createdAt: new Date() };
            logger.info(`[MemoryDB] Saved analysis with ID: ${id}`);
            return;
        }

        try {
            await this.db.collection('waste_analyses').doc(id).set({
                ...data,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            logger.info(`[Firestore] Saved analysis with ID: ${id}`);
        } catch (error) {
            logger.error('Error saving to Firestore, using memory:', error);
            memoryStore[id] = data;
        }
    }

    static async getAnalysis(id: string) {
        if (this.useMemoryFallback || !this.db) {
            return memoryStore[id];
        }

        const doc = await this.db.collection('waste_analyses').doc(id).get();
        return doc.exists ? doc.data() : null;
    }
}

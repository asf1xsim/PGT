// matchmaking-service/src/database/mongo.ts
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

class MongoDB {
    private client: MongoClient | null = null;
    public db: Db | null = null;

    async connect(): Promise<void> {
        try {
            const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27018';
            const dbName = process.env.MONGO_DB_NAME || 'matchmaking_service';

            this.client = new MongoClient(mongoUrl);
            await this.client.connect();
            this.db = this.client.db(dbName);

            console.log(`✅ Connected to MongoDB: ${dbName}`);
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            console.log('✅ Disconnected from MongoDB');
        }
    }
}

const mongo = new MongoDB();
export default mongo;
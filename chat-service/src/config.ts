// chat-service/src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const Config = {
    port: process.env.PORT || 3003,
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
    mongoDbName: process.env.MONGO_DB_NAME || 'chat_service',
};

export default Config;
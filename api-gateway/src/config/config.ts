// api-gateway/src/config/config.ts
import * as dotenv from 'dotenv';

dotenv.config();

export const Config = {
    port: process.env.PORT || 3000,
    services: {
        auth: {
            url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
            path: '/api/auth'
        },
        profile: {
            url: process.env.PROFILE_SERVICE_URL || 'http://localhost:3002',
            path: '/api/profiles'
        },
        chat: {
            url: process.env.CHAT_SERVICE_URL || 'http://localhost:3003',
            path: '/api/chat'
        },
        matchmaking: {
            url: process.env.MATCHMAKING_SERVICE_URL || 'http://localhost:3004',
            path: '/api/matchmaking'
        },
        notification: {
            url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
            path: '/api/notifications'
        }
    }
};
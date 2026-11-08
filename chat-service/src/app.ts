// chat-service/src/app.ts
import 'reflect-metadata';
import { httpServer } from './server';
import mongo from './database/mongo';
import { Config } from './config';

const port = Config.port || 3003;

async function init() {
    try {
        await mongo.connect();
        console.log('MongoDB connected successfully');

        httpServer.listen(port, () => {
            console.log(`Chat Service listening on http://localhost:${port}`);
            console.log(`WebSocket server ready on ws://localhost:${port}`);
            console.log(`API Docs available at http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

init();

export default httpServer;
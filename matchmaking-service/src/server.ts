// matchmaking-service/src/server.ts
import app from './app';
import mongo from './database/mongo';

const PORT = process.env.PORT || 3004;

async function bootstrap() {
    await mongo.connect();

    app.listen(PORT, () => {
        console.log(`🚀 Matchmaking Service running on port ${PORT}`);
        console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    });
}

bootstrap();
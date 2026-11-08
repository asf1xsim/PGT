// matchmaking-service/src/app.ts
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { loggingMiddleware } from './middleware/logging.middleware';
import { apiErrorHandler } from './middleware/error.middleware';
import { MatchmakingController } from './api/controllers/matchmaking.controller';
import { swaggerSpec } from './config/swagger';

const app = express();
const matchmakingController = new MatchmakingController();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Matchmaking service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: matchmaking-service
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'matchmaking-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Matchmaking Service API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true
    }
}));

// Matchmaking routes
app.post('/matchmaking/find', matchmakingController.findMatches.bind(matchmakingController));
app.get('/matchmaking/matches/:id', matchmakingController.getById.bind(matchmakingController));
app.post('/matchmaking/matches', matchmakingController.createRequest.bind(matchmakingController));
app.put('/matchmaking/matches/:id/accept', matchmakingController.acceptMatch.bind(matchmakingController));
app.put('/matchmaking/matches/:id/decline', matchmakingController.declineMatch.bind(matchmakingController));

app.use(apiErrorHandler);

export default app;
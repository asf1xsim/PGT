// api-gateway/src/server.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger.config';

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import chatRoutes from './routes/chat.routes';
import matchmakingRoutes from './routes/matchmaking.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (если нужно)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// ==================== SWAGGER DOCUMENTATION ====================
// Swagger UI доступен по адресу: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'PlayGamesTogether API Docs',
    swaggerOptions: {
        persistAuthorization: true,
    }
}));

// Swagger JSON endpoint (для интеграции с другими инструментами)
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// ==================== HEALTH CHECK ====================
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API Gateway is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'api-gateway',
        version: '1.0.0'
    });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/notifications', notificationRoutes);

// ==================== ROOT ENDPOINT ====================
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to PlayGamesTogether API Gateway',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            profiles: '/api/profiles',
            chat: '/api/chat',
            matchmaking: '/api/matchmaking',
            notifications: '/api/notifications'
        }
    });
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        path: req.path
    });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 API Gateway started successfully!`);
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/api-docs.json`);
    console.log(`\n✅ All services are proxied through this gateway\n`);
});

export default app;
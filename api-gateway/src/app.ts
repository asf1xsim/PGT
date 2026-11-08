// api-gateway/src/app.ts
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { Config } from './config/config';
import { swaggerSpec } from './config/swagger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: API Gateway health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Gateway is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: api-gateway
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'api-gateway',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            auth: Config.services.auth.url,
            profile: Config.services.profile.url,
            chat: Config.services.chat.url,
            matchmaking: Config.services.matchmaking.url,
            notification: Config.services.notification.url
        }
    });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'PlayGamesTogether API Gateway',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true
    }
}));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to PlayGamesTogether API Gateway',
        version: '1.0.0',
        documentation: '/api-docs',
        services: {
            auth: Config.services.auth.path,
            profile: Config.services.profile.path,
            chat: Config.services.chat.path,
            matchmaking: Config.services.matchmaking.path,
            notifications: Config.services.notification.path
        }
    });
});

// Proxy configuration options
const proxyOptions = {
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any) => {
        // Forward authorization header
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        console.log(`[Proxy] ${req.method} ${req.path} -> ${proxyReq.path}`);
    },
    onError: (err: Error, req: any, res: any) => {
        console.error(`[Proxy Error] ${req.method} ${req.path}:`, err.message);
        res.status(502).json({
            code: 'service_unavailable',
            message: 'Target service is unavailable',
            statusCode: 502,
            service: req.path.split('/')[2] // Extract service name from path
        });
    }
};

// Auth Service Proxy
app.use(
    '/api/auth',
    createProxyMiddleware({
        target: Config.services.auth.url,
        pathRewrite: {
            '^/api/auth': '/auth'
        },
        ...proxyOptions
    })
);

// Profile Service Proxy
app.use(
    '/api/profiles',
    createProxyMiddleware({
        target: Config.services.profile.url,
        pathRewrite: {
            '^/api/profiles': '/profiles'
        },
        ...proxyOptions
    })
);

// Chat Service Proxy
app.use(
    '/api/chat',
    createProxyMiddleware({
        target: Config.services.chat.url,
        pathRewrite: {
            '^/api/chat': '/chat'
        },
        ...proxyOptions
    })
);

// Matchmaking Service Proxy
app.use(
    '/api/matchmaking',
    createProxyMiddleware({
        target: Config.services.matchmaking.url,
        pathRewrite: {
            '^/api/matchmaking': '/matchmaking'
        },
        ...proxyOptions
    })
);

// Notification Service Proxy
app.use(
    '/api/notifications',
    createProxyMiddleware({
        target: Config.services.notification.url,
        pathRewrite: {
            '^/api/notifications': '/notifications'
        },
        ...proxyOptions
    })
);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        code: 'not_found',
        message: `Route ${req.method} ${req.path} not found`,
        statusCode: 404,
        availableRoutes: [
            '/api/auth/*',
            '/api/profiles/*',
            '/api/chat/*',
            '/api/matchmaking/*',
            '/api/notifications/*'
        ]
    });
});

// Error Handler
app.use(errorMiddleware);

export default app;
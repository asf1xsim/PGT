// notification-service/src/app.ts
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { loggingMiddleware } from './middleware/logging.middleware';
import { apiErrorHandler } from './middleware/error.middleware';
import { NotificationController } from './api/controllers/notification.controller';
import { swaggerSpec } from './config/swagger';

const app = express();
const notificationController = new NotificationController();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Notification service health check
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
 *                   example: notification-service
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'notification-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Notification Service API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true
    }
}));

// Notification routes
app.post('/notifications/link-telegram', notificationController.linkTelegram.bind(notificationController));
app.post('/notifications/send', notificationController.sendNotification.bind(notificationController));
app.get('/notifications/:id', notificationController.getNotifications.bind(notificationController));
app.put('/notifications/:id/read', notificationController.markAsRead.bind(notificationController));
app.delete('/notifications/:id', notificationController.deleteNotification.bind(notificationController));

app.use(apiErrorHandler);

export default app;
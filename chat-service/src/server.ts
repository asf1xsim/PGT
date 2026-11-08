// chat-service/src/server.ts
import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import {loggingMiddleware} from "./middleware/logging.middleware";
import {ChatController} from "./api/controllers/chat.controller";
import initializeWebSocket from "./websocket/chat.websocket";
import {apiErrorHandler} from "./middleware/error.middleware";
import {setupSwagger} from "./config/swagger";

const app = express();
const httpServer = createServer(app);  // ← ВАЖНО: используем HTTP сервер

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the service is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: chat-service
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 */
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'chat-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Setup Swagger documentation
setupSwagger(app);

// Controllers
const chatController = new ChatController();

// REST API Routes
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'ok', service: 'chat-service' });
});

app.get('/chat/history/:id', (req, res, next) => {
    chatController.getHistory(req, res).catch(next);
});

app.post('/chat/message', (req, res, next) => {
    chatController.sendMessage(req, res).catch(next);
});

app.delete('/chat/message/:id', (req, res, next) => {
    chatController.deleteMessage(req, res).catch(next);
});

// Error handling
app.use(apiErrorHandler);

// ← НОВОЕ: Initialize WebSocket
const io = initializeWebSocket(httpServer);

export { app, httpServer, io };
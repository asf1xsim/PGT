"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const logging_middleware_1 = require("./middleware/logging.middleware");
const chat_controller_1 = require("./api/controllers/chat.controller");
const chat_websocket_1 = __importDefault(require("./websocket/chat.websocket"));
const error_middleware_1 = require("./middleware/error.middleware");
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app); // ← ВАЖНО: используем HTTP сервер
exports.httpServer = httpServer;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(logging_middleware_1.loggingMiddleware);
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
(0, swagger_1.setupSwagger)(app);
// Controllers
const chatController = new chat_controller_1.ChatController();
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
app.use(error_middleware_1.apiErrorHandler);
// ← НОВОЕ: Initialize WebSocket
const io = (0, chat_websocket_1.default)(httpServer);
exports.io = io;

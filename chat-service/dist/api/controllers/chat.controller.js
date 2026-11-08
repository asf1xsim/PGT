"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
require("reflect-metadata");
const chat_service_1 = require("../../services/chat.service");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const base_dto_1 = require("../../types/base.dto");
const api_error_1 = require("../../types/api.error");
class ChatController {
    /**
     * @openapi
     * /chat/history/{id}:
     *   get:
     *     summary: Get chat history
     *     description: Retrieve message history for a specific match
     *     tags: [Chat]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           minLength: 24
     *           maxLength: 24
     *         description: Match ID (MongoDB ObjectId)
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *         description: Maximum number of messages to retrieve
     *     responses:
     *       200:
     *         description: Chat history retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Message'
     *       400:
     *         description: Invalid match ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getHistory(req, res) {
        const { id: matchId } = await (0, validation_middleware_1.validateParams)(req, base_dto_1.IdParam);
        const limit = parseInt(req.query.limit) || 50;
        const messages = await chat_service_1.chatService.getMessageHistory(matchId, limit);
        res.status(200).send(messages);
    }
    /**
     * @openapi
     * /chat/message:
     *   post:
     *     summary: Send a message
     *     description: Send a chat message
     *     tags: [Chat]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - matchId
     *               - senderId
     *               - content
     *             properties:
     *               matchId:
     *                 type: string
     *                 example: "507f1f77bcf86cd799439011"
     *               senderId:
     *                 type: string
     *                 example: "507f1f77bcf86cd799439001"
     *               content:
     *                 type: string
     *                 maxLength: 1000
     *                 example: "Hey! Want to play CS:GO?"
     *     responses:
     *       201:
     *         description: Message sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Message'
     *       400:
     *         description: Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async sendMessage(req, res) {
        const { matchId, senderId, content } = req.body;
        if (!matchId || !senderId || !content) {
            throw new api_error_1.ApiError('bad input', 'matchId, senderId and content are required', 400);
        }
        if (content.length > 1000) {
            throw new api_error_1.ApiError('bad input', 'Message content must not exceed 1000 characters', 400);
        }
        const savedMessage = await chat_service_1.chatService.saveMessage({
            matchId,
            senderId,
            content,
            timestamp: new Date()
        });
        res.status(201).send(savedMessage);
    }
    /**
     * @openapi
     * /chat/message/{id}:
     *   delete:
     *     summary: Delete a message
     *     description: Delete a chat message by ID
     *     tags: [Chat]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Message ID
     *     responses:
     *       204:
     *         description: Message deleted successfully
     *       404:
     *         description: Message not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async deleteMessage(req, res) {
        const { id } = await (0, validation_middleware_1.validateParams)(req, base_dto_1.IdParam);
        const result = await chat_service_1.chatService.deleteMessage(id);
        if (result.deletedCount === 0) {
            throw new api_error_1.ApiError('not found', 'Message not found', 404);
        }
        res.status(204).send();
    }
}
exports.ChatController = ChatController;

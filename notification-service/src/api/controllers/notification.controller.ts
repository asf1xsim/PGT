// notification-service/src/api/controlles/notification.controller.ts
import 'reflect-metadata';
import { Request, Response } from 'express';
import { notificationService } from '../../services/notification.service';
import { validateParams } from '../../middleware/validation.middleware';
import { IdParam } from '../../types/base.dto';
import { ApiError } from '../../types/api.error';

export class NotificationController {

    /**
     * @openapi
     * /notifications/link-telegram:
     *   post:
     *     summary: Link Telegram account
     *     description: Link user account with Telegram for notifications
     *     tags: [Notifications]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userId
     *               - chatId
     *             properties:
     *               userId:
     *                 type: string
     *                 example: "507f1f77bcf86cd799439001"
     *               chatId:
     *                 type: string
     *                 example: "123456789"
     *     responses:
     *       200:
     *         description: Telegram linked successfully
     *       400:
     *         description: Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async linkTelegram(req: Request, res: Response) {
        const { userId, chatId } = req.body;

        if (!userId || !chatId) {
            throw new ApiError(
                'bad input',
                'userId and chatId are required',
                400
            );
        }

        const result = await notificationService.linkTelegramUser(userId, chatId);
        res.status(200).send(result);
    }

    /**
     * @openapi
     * /notifications/send:
     *   post:
     *     summary: Send notification
     *     description: Send notification to user
     *     tags: [Notifications]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userId
     *               - type
     *               - title
     *               - message
     *             properties:
     *               userId:
     *                 type: string
     *                 example: "507f1f77bcf86cd799439001"
     *               type:
     *                 type: string
     *                 enum: [match_request, match_accepted, match_declined, new_message]
     *                 example: "match_request"
     *               title:
     *                 type: string
     *                 example: "New Match Request"
     *               message:
     *                 type: string
     *                 example: "Player123 wants to play CS:GO with you!"
     *     responses:
     *       201:
     *         description: Notification sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notification'
     *       400:
     *         description: Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async sendNotification(req: Request, res: Response) {
        const { userId, type, title, message } = req.body;

        if (!userId || !type || !title || !message) {
            throw new ApiError(
                'bad input',
                'userId, type, title and message are required',
                400
            );
        }

        const notification = await notificationService.sendNotification({
            userId,
            type,
            title,
            message
        });

        res.status(201).send(notification);
    }

    /**
     * @openapi
     * /notifications/{id}:
     *   get:
     *     summary: Get user notifications
     *     description: Retrieve notifications for a specific user
     *     tags: [Notifications]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 20
     *         description: Maximum number of notifications
     *     responses:
     *       200:
     *         description: Notifications retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Notification'
     */
    async getNotifications(req: Request, res: Response) {
        const { id: userId } = await validateParams(req, IdParam);
        const limit = parseInt(req.query.limit as string) || 20;

        const notifications = await notificationService.getNotifications(userId, limit);
        res.status(200).send(notifications);
    }

    /**
     * @openapi
     * /notifications/{id}/read:
     *   put:
     *     summary: Mark notification as read
     *     description: Mark a notification as read
     *     tags: [Notifications]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Notification ID
     *     responses:
     *       200:
     *         description: Notification marked as read
     *       404:
     *         description: Notification not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async markAsRead(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const result = await notificationService.markAsRead(id);

        if (result.matchedCount === 0) {
            throw new ApiError('not found', 'Notification not found', 404);
        }

        res.status(200).send({ success: true });
    }

    /**
     * @openapi
     * /notifications/{id}:
     *   delete:
     *     summary: Delete notification
     *     description: Delete a notification by ID
     *     tags: [Notifications]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Notification ID
     *     responses:
     *       204:
     *         description: Notification deleted successfully
     *       404:
     *         description: Notification not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async deleteNotification(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const result = await notificationService.deleteNotification(id);

        if (result.deletedCount === 0) {
            throw new ApiError('not found', 'Notification not found', 404);
        }

        res.status(204).send();
    }
}
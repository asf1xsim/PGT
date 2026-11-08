// api-gateway/src/routes/notification.routes.ts
import { Router } from 'express';
import axios from 'axios';

const router = Router();
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3005';

/**
 * @openapi
 * /api/notifications/link-telegram:
 *   post:
 *     summary: Link Telegram account
 *     description: Link user account with Telegram
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TelegramLinkDto'
 *     responses:
 *       200:
 *         description: Telegram linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TelegramLinkResponse'
 */
router.post('/link-telegram', async (req, res) => {
    try {
        const response = await axios.post(
            `${NOTIFICATION_SERVICE_URL}/notifications/link-telegram`,
            req.body,
            {
                headers: {
                    'Authorization': req.headers.authorization,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/notifications/send:
 *   post:
 *     summary: Send notification
 *     description: Send notification to user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationDto'
 *     responses:
 *       201:
 *         description: Notification sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 */
router.post('/send', async (req, res) => {
    try {
        const response = await axios.post(
            `${NOTIFICATION_SERVICE_URL}/notifications/send`,
            req.body,
            {
                headers: {
                    'Authorization': req.headers.authorization,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(201).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/notifications/{id}:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve notifications for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *         description: Max notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { limit } = req.query;

        const response = await axios.get(
            `${NOTIFICATION_SERVICE_URL}/notifications/${id}`,
            {
                params: { limit },
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${NOTIFICATION_SERVICE_URL}/notifications/${id}/read`,
            {},
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     description: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       204:
 *         description: Notification deleted
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await axios.delete(
            `${NOTIFICATION_SERVICE_URL}/notifications/${id}`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.status(204).send();
    } catch (error: any) {
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

export default router;
// api-gateway/src/routes/matchmaking.routes.ts
import { Router } from 'express';
import axios from 'axios';

const router = Router();
const MATCHMAKING_SERVICE_URL = process.env.MATCHMAKING_SERVICE_URL || 'http://matchmaking-service:3004';

/**
 * @openapi
 * /api/matchmaking/find:
 *   get:
 *     summary: Find matches
 *     description: Find available pending matches
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 */
router.get('/find', async (req, res) => {
    try {
        const { page, limit } = req.query;

        console.log('Finding matches:', { page, limit });

        const response = await axios.get(
            `${MATCHMAKING_SERVICE_URL}/matchmaking/find`,
            {
                params: { page, limit },
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error finding matches:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/matchmaking/matches:
 *   post:
 *     summary: Create match request
 *     description: Send a match request to another player
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MatchRequestDto'
 *     responses:
 *       201:
 *         description: Match request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */
router.post('/matches', async (req, res) => {
    try {
        const response = await axios.post(
            `${MATCHMAKING_SERVICE_URL}/matchmaking/matches`,
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
        console.error('Error creating match:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/matchmaking/matches/{id}:
 *   get:
 *     summary: Get match by ID
 *     description: Retrieve match details
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */
router.get('/matches/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(
            `${MATCHMAKING_SERVICE_URL}/matchmaking/matches/${id}`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error getting match:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/matchmaking/matches/{id}/accept:
 *   put:
 *     summary: Accept match request
 *     description: Accept a pending match request
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */
router.put('/matches/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${MATCHMAKING_SERVICE_URL}/matchmaking/matches/${id}/accept`,
            {},
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error accepting match:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/matchmaking/matches/{id}/decline:
 *   put:
 *     summary: Decline match request
 *     description: Decline a pending match request
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match declined
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */
router.put('/matches/:id/decline', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${MATCHMAKING_SERVICE_URL}/matchmaking/matches/${id}/decline`,
            {},
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error declining match:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

export default router;
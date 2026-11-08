// api-gateway/src/routes/profile.routes.ts
import { Router } from 'express';
import axios from 'axios';

const router = Router();
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://profile-service:3002';

/**
 * @openapi
 * /api/profiles:
 *   get:
 *     summary: Get all profiles
 *     description: Retrieve list of all gaming profiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: List of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 */
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            `${PROFILE_SERVICE_URL}/profiles`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching profiles:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles:
 *   post:
 *     summary: Create profile
 *     description: Create a new gaming profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       201:
 *         description: Profile created successfully
 */
router.post('/', async (req, res) => {
    try {
        const response = await axios.post(
            `${PROFILE_SERVICE_URL}/profiles`,
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
        console.error('Error creating profile:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles/search:
 *   get:
 *     summary: Search profiles
 *     description: Search profiles by username, games, or genres
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        const response = await axios.get(
            `${PROFILE_SERVICE_URL}/profiles/search`,
            {
                params: { query },
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error searching profiles:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles/me:
 *   get:
 *     summary: Get my profile
 *     description: Get authenticated user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: Profile not found
 */
router.get('/me', async (req, res) => {
    try {
        const response = await axios.get(
            `${PROFILE_SERVICE_URL}/profiles/me`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching my profile:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     description: Retrieve a specific profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile found
 *       404:
 *         description: Profile not found
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(
            `${PROFILE_SERVICE_URL}/profiles/${id}`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching profile by ID:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles/{id}:
 *   put:
 *     summary: Update profile
 *     description: Update profile information
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${PROFILE_SERVICE_URL}/profiles/${id}`,
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
        console.error('Error updating profile:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles/{id}/online:
 *   put:
 *     summary: Update online status
 *     description: Update user's online status
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OnlineStatusDto'
 *     responses:
 *       200:
 *         description: Online status updated
 */
router.put('/:id/online', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${PROFILE_SERVICE_URL}/profiles/${id}/online`,
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
        console.error('Error updating online status:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

/**
 * @openapi
 * /api/profiles/{id}:
 *   delete:
 *     summary: Delete profile
 *     description: Delete a profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       204:
 *         description: Profile deleted
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await axios.delete(
            `${PROFILE_SERVICE_URL}/profiles/${id}`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        );

        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting profile:', error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message
        });
    }
});

export default router;
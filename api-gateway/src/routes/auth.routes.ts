// api-gateway/src/routes/auth.routes.ts
import { Router } from 'express';
import axios from 'axios';

const router = Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post('/register', async (req, res) => {
    try {
        const response = await axios.post(
            `${AUTH_SERVICE_URL}/auth/register`,
            req.body,
            {
                headers: {
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
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(
            `${AUTH_SERVICE_URL}/auth/login`,
            req.body,
            {
                headers: {
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
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/profile', async (req, res) => {
    try {
        const response = await axios.get(
            `${AUTH_SERVICE_URL}/auth/profile`,
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
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Invalidate user's JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', async (req, res) => {
    try {
        const response = await axios.post(
            `${AUTH_SERVICE_URL}/auth/logout`,
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
 * /api/auth/user/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${AUTH_SERVICE_URL}/auth/user/${id}`,
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
 * /api/auth/user/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await axios.delete(
            `${AUTH_SERVICE_URL}/auth/user/${id}`,
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

/**
 * @openapi
 * /api/auth/verify:
 *   post:
 *     summary: Verify JWT token
 *     description: Validate JWT token and get user info
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTokenRequest'
 *     responses:
 *       200:
 *         description: Token verification result
 */
router.post('/verify', async (req, res) => {
    try {
        const response = await axios.post(
            `${AUTH_SERVICE_URL}/auth/verify`,
            req.body,
            {
                headers: {
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

export default router;
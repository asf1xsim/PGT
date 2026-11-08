// auth-service/src/api/server.ts
import express = require('express');
import {apiErrorHandler} from "./middleware/error.middleware";
import {AuthController} from "./controllers/auth.controller";
import swaggerUi = require('swagger-ui-express');
import {swaggerSpec} from "../utils/swagger";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Auth Service API',
    customCss: '.swagger-ui .topbar { display: none }'
}));

// Health check
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the service is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
const authController = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with username, email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/register', authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/login', authController.login);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Get authenticated user information
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/auth/profile', authController.getProfile);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate user authentication token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Logged out successfully'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/logout', authController.logout);

/**
 * @openapi
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user account by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *         description: User ID (MongoDB ObjectId)
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/auth/users/:id', authController.deleteUser);

/**
 * @openapi
 * /auth/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *         description: User ID (MongoDB ObjectId)
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/auth/users/:id', authController.updateUser);

/**
 * @openapi
 * /auth/verify:
 *   post:
 *     summary: Verify token
 *     description: Verify if a token is valid (used for inter-service communication)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTokenRequest'
 *     responses:
 *       200:
 *         description: Token verification result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyTokenResponse'
 */
app.post('/auth/verify', authController.verifyToken);

// Error handling
app.use(apiErrorHandler);
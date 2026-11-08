// profile-service/src/server.ts
import express = require('express');
import swaggerUi = require('swagger-ui-express');
import { swaggerSpec } from './utils/swagger';
import { ProfileController } from './api/controllers/profile.controller';
import { authMiddleware } from './api/middleware/auth.middleware';
import { apiErrorHandler } from './api/middleware/error.middleware';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Profile Service API',
    customCss: '.swagger-ui .topbar { display: none }'
}));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'profile-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const profileController = new ProfileController();

/**
 * @openapi
 * /profiles:
 *   get:
 *     summary: Get all profiles
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
app.get('/profiles', profileController.getAll.bind(profileController));

/**
 * @openapi
 * /profiles/search:
 *   get:
 *     summary: Search profiles
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid query
 */
app.get('/profiles/search', profileController.search.bind(profileController));

/**
 * @openapi
 * /profiles/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
app.get('/profiles/me', authMiddleware, profileController.getMyProfile.bind(profileController));

/**
 * @openapi
 * /profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile found
 *       404:
 *         description: Profile not found
 */
app.get('/profiles/:id', profileController.getById.bind(profileController));

/**
 * @openapi
 * /profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       201:
 *         description: Profile created
 *       400:
 *         description: Invalid input
 */
app.post('/profiles', profileController.create.bind(profileController));

/**
 * @openapi
 * /profiles/{id}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       200:
 *         description: Profile updated
 *       404:
 *         description: Profile not found
 */
app.put('/profiles/:id', profileController.update.bind(profileController));

/**
 * @openapi
 * /profiles/{id}:
 *   delete:
 *     summary: Delete a profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Profile deleted
 *       404:
 *         description: Profile not found
 */
app.delete('/profiles/:id', profileController.delete.bind(profileController));

/**
 * @openapi
 * /profiles/{id}/online:
 *   put:
 *     summary: Update online status
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isOnline:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Online status updated
 *       404:
 *         description: Profile not found
 */
app.put('/profiles/:id/online', profileController.updateOnlineStatus.bind(profileController));


app.use(apiErrorHandler);
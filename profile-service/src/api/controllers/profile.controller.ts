// profile-service/src/api/controller/profile.controller.ts
import { Request, Response } from 'express';
import { IdParam } from '../../types/base.dto';
import { ProfileDto, SearchQuery, OnlineStatusDto } from '../../types/profile.dto';
import { profileService } from '../../services/profile.service';
import { ApiError } from '../../types/api.error';
import { validateBody, validateParams, validateQuery } from '../middleware/validation.middleware';

export class ProfileController {

    /**
     * @openapi
     * /profiles:
     *   get:
     *     summary: Get all profiles
     *     tags: [Profiles]
     *     responses:
     *       200:
     *         description: List of profiles
     */
    async getAll(req: Request, res: Response) {
        const profiles = await profileService.getAll();
        res.status(200).send(profiles);
    }

    /**
     * @openapi
     * /profiles:
     *   post:
     *     summary: Create profile
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
     */
    async create(req: Request, res: Response) {
        const dto = await validateBody(req, ProfileDto);
        const profile = await profileService.create(dto);
        res.status(201).send(profile);
    }

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
    async getById(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const profile = await profileService.getById(id);

        if (!profile) {
            throw new ApiError('not found', 'Profile not found', 404);
        }

        res.status(200).send(profile);
    }

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
    async getMyProfile(req: Request, res: Response) {
        const userId = (req as any).user?.userId;

        if (!userId) {
            throw new ApiError('unauthorized', 'User not authenticated', 401);
        }

        const profile = await profileService.getByUserId(userId);

        if (!profile) {
            throw new ApiError('not found', 'Profile not found', 404);
        }

        res.status(200).send(profile);
    }

    /**
     * @openapi
     * /profiles/{id}:
     *   put:
     *     summary: Update profile
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
    async update(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const dto = await validateBody(req, ProfileDto);

        const profile = await profileService.update(id, dto);

        if (!profile) {
            throw new ApiError('not found', 'Profile not found', 404);
        }

        res.status(200).send(profile);
    }

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
    async updateOnlineStatus(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const { isOnline } = await validateBody(req, OnlineStatusDto);

        const profile = await profileService.updateOnlineStatus(id, isOnline);

        if (!profile) {
            throw new ApiError('not found', 'Profile not found', 404);
        }

        res.status(200).send(profile);
    }

    /**
     * @openapi
     * /profiles/{id}:
     *   delete:
     *     summary: Delete profile
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
    async delete(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const result = await profileService.delete(id);

        if (result.deletedCount === 0) {
            throw new ApiError('not found', 'Profile not found', 404);
        }

        res.status(204).send();
    }

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
     *     responses:
     *       200:
     *         description: Search results
     */
    async search(req: Request, res: Response) {
        const { query } = await validateQuery(req, SearchQuery);

        const profiles = await profileService.search(query);
        res.status(200).send(profiles);
    }


}
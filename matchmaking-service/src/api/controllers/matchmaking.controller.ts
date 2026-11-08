// matchmaking-service/src/api/controllers/matchmaking.controller.ts
import 'reflect-metadata';
import {Request, Response} from 'express';
import {validateBody, validateParams, validateQuery} from "../../middleware/validation.middleware";
import {MatchRequestDto} from "../../types/dto/matchmaking.dto";
import {profileService} from "../../services/profile.service";
import {ApiError} from "../../types/api.error";
import {matchmakingService} from "../../services/matchmaking.service";
import {IdParam, PaginationDto} from "../../types/base.dto";
import {MatchStatus} from "../../database/models/match.model";

export class MatchmakingController {

    /**
     * @openapi
     * /matches:
     *   post:
     *     summary: Create a match request
     *     description: Create a new match request between two profiles
     *     tags:
     *       - Matchmaking
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - requesterProfileId
     *               - targetProfileId
     *               - game
     *             properties:
     *               requesterProfileId:
     *                 type: string
     *                 minLength: 24
     *                 maxLength: 24
     *                 description: Requester profile ID (MongoDB ObjectId)
     *               targetProfileId:
     *                 type: string
     *                 minLength: 24
     *                 maxLength: 24
     *                 description: Target profile ID (MongoDB ObjectId)
     *               game:
     *                 type: string
     *                 minLength: 2
     *                 maxLength: 100
     *                 description: Game name
     *               message:
     *                 type: string
     *                 maxLength: 300
     *                 description: Optional message
     *     responses:
     *       201:
     *         description: Match request created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Match'
     *       400:
     *         description: Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Profile not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async createRequest(req: Request, res: Response) {
        const dto = await validateBody(req, MatchRequestDto);

        const requesterProfile = await profileService.getById(dto.requesterProfileId);
        const targetProfile = await profileService.getById(dto.targetProfileId);

        if (!requesterProfile) {
            throw new ApiError('not found', 'Requester profile not found', 404);
        }

        if (!targetProfile) {
            throw new ApiError('not found', 'Target profile not found', 404);
        }

        const match = await matchmakingService.createRequest(dto);
        res.status(201).send(match);
    }

    /**
     * @openapi
     * /matches/{id}:
     *   get:
     *     summary: Get match by ID
     *     description: Retrieve a single match by its ID
     *     tags:
     *       - Matchmaking
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           minLength: 24
     *           maxLength: 24
     *         description: Match ID (MongoDB ObjectId)
     *     responses:
     *       200:
     *         description: Match found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Match'
     *       400:
     *         description: Invalid ID format
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Match not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getById(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const match = await matchmakingService.getById(id);

        if (!match) {
            throw new ApiError('not found', 'Match not found', 404);
        }

        res.status(200).send(match);
    }

    /**
     * @openapi
     * /matches/{id}/accept:
     *   put:
     *     summary: Accept a match request
     *     description: Accept a pending match request
     *     tags:
     *       - Matchmaking
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           minLength: 24
     *           maxLength: 24
     *         description: Match ID (MongoDB ObjectId)
     *     responses:
     *       200:
     *         description: Match accepted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Match'
     *       400:
     *         description: Invalid ID format
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Match not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async acceptMatch(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const result = await matchmakingService.acceptMatch(id);

        if (!result) {
            throw new ApiError('not found', 'Match not found', 404);
        }
        res.status(200).send(result);
    }

    /**
     * @openapi
     * /matches/{id}/decline:
     *   put:
     *     summary: Decline a match request
     *     description: Decline a pending match request
     *     tags:
     *       - Matchmaking
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           minLength: 24
     *           maxLength: 24
     *         description: Match ID (MongoDB ObjectId)
     *     responses:
     *       200:
     *         description: Match declined successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Match'
     *       400:
     *         description: Invalid ID format
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Match not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async declineMatch(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const result = await matchmakingService.declineMatch(id);

        if (!result) {
            throw new ApiError('not found', 'Match not found', 404);
        }
        res.status(200).send(result);
    }

    /**
     * @openapi
     * /matches/find:
     *   get:
     *     summary: Find potential matches
     *     description: Find profiles that match specified criteria
     *     tags:
     *       - Matchmaking
     *     parameters:
     *       - in: query
     *         name: game
     *         schema:
     *           type: string
     *         description: Filter by game
     *       - in: query
     *         name: genres
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *         description: Filter by genres
     *       - in: query
     *         name: skillLevel
     *         schema:
     *           type: string
     *           enum: [beginner, intermediate, advanced, expert]
     *         description: Filter by skill level
     *     responses:
     *       200:
     *         description: List of matching profiles
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Profile'
     */
    async findMatches(req: Request, res: Response) {
        const pagination = await validateQuery(req, PaginationDto);

        // Безопасное использование значений
        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;

        const matches = await matchmakingService.findMatches(page, limit);
        res.status(200).send(matches);
    }
}
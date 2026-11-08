// auth-service/src/api/controllers/auth.controller.ts
import 'reflect-metadata';
import {Request, Response} from 'express';
import {validateBody, validateParams} from "../middleware/validation.middleware";
import {IdParam, LoginDto, RegisterDto, UpdateUserDto} from "../../types/auth.dto";
import {authService} from "../../services/auth.service";
import {ApiError} from "../../types/api.error";

export class AuthController {

    async register(req: Request, res: Response) {
        const dto = await validateBody(req, RegisterDto);
        try {
            const result = await authService.register(dto);
            res.status(201).send(result);
        } catch (error) {
            throw new ApiError('bad input', error.message, 400);
        }
    }

    async login(req: Request, res: Response) {
        const dto = await validateBody(req, LoginDto);
        try {
            const result = await authService.login(dto);
            res.status(200).send(result);
        } catch (error) {
            throw new ApiError('unauthorized', 'Invalid credentials', 401);
        }
    }

    async getProfile(req: Request, res: Response) {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError('unauthorized', 'Token required', 401);
        }

        const user = await authService.verifyToken(token);

        if (!user) {
            throw new ApiError('unauthorized', 'Invalid token', 401);
        }

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email
        });
    }

    async logout(req: Request, res: Response) {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError('unauthorized', 'Token required', 401);
        }

        await authService.logout(token);
        res.status(200).send({message: 'Logged out successfully'});
    }

    async deleteUser(req: Request, res: Response) {
        const {id} = await validateParams(req, IdParam);
        const result = await authService.deleteUser(id);

        if (result.deletedCount === 0) {
            throw new ApiError('not found', 'User not found', 404);
        }

        res.status(204).send();
    }

    async updateUser(req: Request, res: Response) {
        const {id} = await validateParams(req, IdParam);
        const dto = await validateBody(req, UpdateUserDto);

        const result = await authService.updateUser(id, dto);

        if (!result || !result.value) {
            throw new ApiError('not found', 'User not found', 404);
        }

        res.status(200).send({
            id: result.value._id,
            username: result.value.username,
            email: result.value.email
        });
    }

    async verifyToken(req: Request, res: Response) {
        const {token} = req.body;

        if (!token) {
            throw new ApiError('bad input', 'Token is required', 400);
        }

        const user = await authService.verifyToken(token);

        if (!user) {
            res.status(200).send({valid: false});
            return;
        }

        res.status(200).send({
            valid: true,
            userId: user._id,
            username: user.username,
            email: user.email
        });
    }
}
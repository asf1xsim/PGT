// profile-service/src/api/middleware/auth.middlewate.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../types/api.error';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError('unauthorized', 'Token required', 401);
        }
        (req as any).user = {
            userId: token
        };

        next();
    } catch (error) {
        next(error);
    }
};
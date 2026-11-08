// api-gateway/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[API Gateway Error]', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Gateway Error';

    res.status(statusCode).json({
        code: err.code || 'gateway_error',
        message: message,
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: req.path
    });
};
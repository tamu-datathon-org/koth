import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if request is authenticated with the correct secret token
 * @param secretKey Key to look for in Auth header
 */
export const secretKeyAuth = (secretKey: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization === secretKey) {
        return next();
    }
    return res.status(401).send();
} 
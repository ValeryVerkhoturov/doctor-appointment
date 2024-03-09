import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {env} from "../env";

// Extend the Express request types to include the userId property
declare global {
    namespace Express {
        interface Request {
            userId: number;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.headers.authorization;

    // pass routes to get jwt
    if (req.path === '/api/v1/users/sendCode' || req.path === '/api/v1/users/verifyCode') {
        return next();
    }

    if (authHeader) {
        const token: string = authHeader.split(' ')[1];

        jwt.verify(token, env.jwtSecret, (err: any, decoded: any) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.userId = Number(decoded.id);
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
};
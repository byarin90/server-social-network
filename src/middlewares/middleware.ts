import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../configuration/secret';

interface IDecodedToken {
    _id: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            payload?: IDecodedToken;
        }
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No token found. Unauthorized.' });
    }

    jwt.verify(token, secret.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decodedToken: object | undefined) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.payload = decodedToken as IDecodedToken;

        next();
    });
};
export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No token found. Unauthorized.' });
    }

    jwt.verify(token, secret.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decodedToken: object | undefined) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }

        req.payload = decodedToken as IDecodedToken;
        if(req.payload.role !== 'admin'){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    });
};

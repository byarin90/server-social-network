import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../configuration/secret';
import { IUser, User } from "../models/userModel";
import { createJWT } from "../utils/jwtUtil";
import RefreshToken from '../models/refreshTokenModel';

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

// Clears authentication cookies
const clearCookies = (res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
}

// Middleware for user authentication
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  try {
    const decoded = jwt.verify(accessToken, secret.JWT_SECRET) as IDecodedToken;
    req.payload = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        console.log(1)
        return res.status(401).json({ errorCode: 'MW401', errorMessage: 'Refresh token not found. Please login again.' });
      }
      jwt.verify(refreshToken, secret.JWT_SECRET, async (err: jwt.VerifyErrors | null, decodedToken: object | undefined) => {
        if (err) {
          clearCookies(res);
          console.log(2)

          return res.status(403).json({ errorCode: 'MW403', errorMessage: 'Invalid or expired refresh token. Please login again.' });
        }
        const decodedRefreshToken = decodedToken as IDecodedToken;
        const refreshTokenDB = await RefreshToken.findOne({ user: decodedRefreshToken._id }).populate('user');
        const user = refreshTokenDB.user as IUser;
        if (refreshTokenDB.token !== refreshToken) {
          clearCookies(res);
          //delete refresh token from database
          await RefreshToken.deleteMany({ user: user._id });
          return res.status(403).json({ errorCode: 'MW403', errorMessage: 'Invalid refresh token. Please login again.' });
        }

        const newAccessToken = createJWT(user,secret.TTL_ACCESS_TOKEN);
        res.cookie('access_token', newAccessToken, { httpOnly: true, sameSite: 'lax' });
        req.payload = decodedRefreshToken;
        next();
      });
    } else {
      clearCookies(res);
      return res.status(403).json({ errorCode: 'MW403', errorMessage: 'Invalid token. Please login again.' });
    }
  }
};

// Middleware for admin authentication
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Use authenticateUser middleware to authenticate user
    await authenticateUser(req, res, async () => {
      // After the user is authenticated, check if they are an admin
      if (req.payload?.role !== 'admin') {
        return res.status(403).json({ errorCode: 'MW403', errorMessage: 'Forbidden: Admin access only.' });
      }
      // If they are an admin, continue with the next middleware
      next();
    });
};

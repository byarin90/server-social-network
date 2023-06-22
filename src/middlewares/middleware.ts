// Importing required dependencies and modules
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../configuration/secret';
import { IUser, User } from "../models/userModel";
import { createJWT } from "../utils/jwtUtil";
import RefreshToken from '../models/refreshTokenModel';

// Defining an interface for decoded tokens
interface IDecodedToken {
  _id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// Modifying the Express.Request type to include a payload
declare global {
  namespace Express {
    interface Request {
      payload?: IDecodedToken;
    }
  }
}

// Function to clear authentication cookies
const clearCookies = (res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
}

// Middleware to authenticate users
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  try {
    // Verify the access token and set the decoded payload on the request
    const decoded = jwt.verify(accessToken, secret.JWT_SECRET) as IDecodedToken;
    req.payload = decoded;
    next();
  } catch (error) {
    // If the token has expired and a refresh token exists, try to refresh the access token
    if (error instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return res.status(401).json({ errorCode: 'MW401', errorMessage: 'Refresh token not found. Please login again.' });
      }
      jwt.verify(refreshToken, secret.JWT_SECRET, async (err: jwt.VerifyErrors | null, decodedToken: object | undefined) => {
        if (err) {
          clearCookies(res);

          return res.status(401).json({ errorCode: 'MW401', errorMessage: 'Invalid or expired refresh token. Please login again.' });
        }
        const decodedRefreshToken = decodedToken as IDecodedToken;
        const refreshTokenDB = await RefreshToken.findOne({ user: decodedRefreshToken._id }).populate('user');
        const user = refreshTokenDB.user as IUser;
        if (refreshTokenDB.token !== refreshToken) {
          clearCookies(res);
          //delete refresh token from database
          await RefreshToken.deleteMany({ user: user._id });
          return res.status(401).json({ errorCode: 'MW401', errorMessage: 'Invalid refresh token. Please login again.' });
        }

        const newAccessToken = createJWT(user,secret.TTL_ACCESS_TOKEN);
        res.cookie('access_token', newAccessToken, { httpOnly: true, sameSite: 'lax' });
        req.payload = decodedRefreshToken;
        next();
      });
    } else {
      // If the token is invalid, clear cookies and ask user to login again
      clearCookies(res);
      return res.status(401).json({ errorCode: 'MW401', errorMessage: 'Invalid token. Please login again.' });
    }
  }
};

// Middleware for admin authentication
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // First, authenticate the user using the authenticateUser middleware
    await authenticateUser(req, res, async () => {
      // Once the user is authenticated, check if the user is an admin
      if (req.payload?.role !== 'admin') {
        // If not an admin, return a Forbidden status
        return res.status(401).json({ errorCode: 'MW403', errorMessage: 'Forbidden: Admin access only.' });
      }
      // If the user is an admin, continue to the next middleware
      next();
    });
};

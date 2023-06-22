import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../configuration/secret';
import { IUser } from "../models/userModel";
import { createJWT } from "../utils/jwtUtil";
import RefreshToken, { IRefreshToken } from '../models/refreshTokenModel';

export interface IDecodedToken {
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

const clearCookies = (res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if(!accessToken){
    console.log("No access token found");
    clearCookies(res);
    return res.status(401).json({ message: "Unauthorized. Access token required.", errorCode: "MW401" });
  }
  try {
    console.log("Verifying access token");
    const decoded = jwt.verify(accessToken, secret.JWT_SECRET) as IDecodedToken;
    req.payload = decoded;
    next();
  } catch (error) {
    if(!refreshToken){
      console.log("No refresh token found");
      clearCookies(res);
      return res.status(401).json({ message: "Unauthorized. Refresh token required.", errorCode: "MW401" });
    }

    if (error instanceof jwt.TokenExpiredError) {
      console.log("Access token expired");
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, secret.JWT_SECRET) as IDecodedToken;
        const newAccessToken = createJWT(decodedRefreshToken, secret.TTL_ACCESS_TOKEN);
        const newRefreshToken=createJWT(decodedRefreshToken, secret.TTL_REFRESH_TOKEN);
        const {matchedCount,modifiedCount} = await RefreshToken.updateOne({ user: decodedRefreshToken._id,token:refreshToken}, { token: newRefreshToken });
        if(!matchedCount && !modifiedCount){
          console.log("Refresh token not found");
          clearCookies(res);
          return res.status(401).json({ message: "Unauthorized. Refresh token required.", errorCode: "MW401" });
        }
        
        res.cookie('access_token', newAccessToken, { httpOnly: true, sameSite: "strict" });
        res.cookie('refresh_token', newRefreshToken, { httpOnly: true, sameSite: "strict" });

        req.payload = decodedRefreshToken;
        console.log("Access token refreshed");
        next();

      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          console.log("Refresh token expired");
          clearCookies(res);
          return res.status(401).json({ message: "Unauthorized. Refresh token required.", errorCode: "MW401" });
        }
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorCode: "MW500" });
      }
    }
  }
}


export const authAdmin=async ({payload:{role}}: Request, res: Response, next: NextFunction) =>{
if(role=='admin'){
   return next();
}
  res.status(403).json({ message: 'Forbidden. You are not allowed to access this endpoint.', errorCode: "MW403" });
}

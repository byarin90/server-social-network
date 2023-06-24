import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { secret } from "../configuration/secret";
import { createJWT, saveAccessTokenOnCookie, saveRefreshTokenOnCookie } from "../utils/jwtUtil";
import RefreshToken from "../models/refreshTokenModel";
import { unauthorizedError } from "../constant/constant";

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
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if (!accessToken) {
    clearCookies(res);
    return res
      .status(401)
      .json(unauthorizedError.accessToken);
  }
  try {
    const decoded = jwt.verify(accessToken, secret.JWT_SECRET) as IDecodedToken;
    req.payload = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      clearCookies(res);
      return res
        .status(401)
        .json(unauthorizedError.refreshToken);
    }

    if (error instanceof jwt.TokenExpiredError || error instanceof JsonWebTokenError) {
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          secret.JWT_SECRET
        ) as IDecodedToken;
        const newAccessToken = createJWT(
          decodedRefreshToken,
          secret.TTL_ACCESS_TOKEN
        );
        const newRefreshToken = createJWT(
          decodedRefreshToken,
          secret.TTL_REFRESH_TOKEN
        );
        const { matchedCount, modifiedCount } = await RefreshToken.updateOne(
          { user: decodedRefreshToken._id, token: refreshToken },
          { token: newRefreshToken }
        );
        if (!matchedCount && !modifiedCount) {
          clearCookies(res);
          return res
            .status(401)
            .json(unauthorizedError.refreshToken);
        }

        saveAccessTokenOnCookie(res, newAccessToken);
        saveRefreshTokenOnCookie(res, newRefreshToken);

        req.payload = decodedRefreshToken;
        next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof JsonWebTokenError) {
          clearCookies(res);
          return res
            .status(401)
            .json(unauthorizedError.refreshToken);
        }
        console.error(error);
        return res
          .status(500)
          .json(unauthorizedError.internalServerError);
      }
    }
  }
};

export const authAdmin = async (
  { payload: { role } }: Request,
  res: Response,
  next: NextFunction
) => {
  if (role === "admin") {
    return next();
  }
  res
    .status(403)
    .json(unauthorizedError.forbidden);
};

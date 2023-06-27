// Imports necessary for middleware functionality
import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { secret } from "../configuration/secret";
import { clearTokensFromCookies, createJWT, saveAccessTokenOnCookie, saveRefreshTokenOnCookie } from "../utils/jwtUtil";
import RefreshToken from "../models/refreshTokenModel";
import { unauthorizedError } from "../constant/constant";

//? This is a type definition for the payload of the JWT
export interface IDecodedToken {
  _id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

//? This is a modification of the Express.Request interface to include payload, used below in authenticateUser
declare global {
  namespace Express {
    interface Request {
      payload?: IDecodedToken;
    }
  }
}

//TODO: authenticateUser is a middleware for validating access and refresh JWT tokens, if access token is invalid, 
//? it tries to generate a new one using the refresh token.
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //TODO: Get access and refresh tokens from cookies
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  
  //! If there's no access token, clear cookies and respond with a 401 Unauthorized error
  if (!accessToken) {
    clearTokensFromCookies(res);
    return res
      .status(401)
      .json(unauthorizedError.accessToken);
  }

  try {
    //! Verify the access token, if it's valid then assign the decoded payload to the request object and call next
    const decoded = jwt.verify(accessToken, secret.JWT_SECRET) as IDecodedToken;
    req.payload = decoded;
    next();
  } catch (error) {
    //! If there's no refresh token and the access token verification failed, clear cookies and respond with a 401 Unauthorized error
    if (!refreshToken) {
      clearTokensFromCookies(res);
      return res
        .status(401)
        .json(unauthorizedError.refreshToken);
    }

    //! If the error is because the token expired or it's invalid, try to create new tokens
    if (error instanceof jwt.TokenExpiredError || error instanceof JsonWebTokenError) {
      try {
        //TODO: Verify the refresh token, and if it's valid create new access and refresh tokens
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

        //TODO: Update the stored refresh token in the database, if it's not found or can't be updated then clear cookies and respond with a 401 Unauthorized error
        const { matchedCount, modifiedCount } = await RefreshToken.updateOne(
          { user: decodedRefreshToken._id, token: refreshToken },
          { token: newRefreshToken }
        );
        if (!matchedCount && !modifiedCount) {
          clearTokensFromCookies(res);
          return res
            .status(401)
            .json(unauthorizedError.refreshToken);
        }

        //? Save the newly created tokens in the cookies
        saveAccessTokenOnCookie(res, newAccessToken);
        saveRefreshTokenOnCookie(res, newRefreshToken);

        //? Assign the decoded refresh token payload to the request object and call next
        req.payload = decodedRefreshToken;
        next();
      } catch (error) {
        //! If the refresh token also expired or invalid, clear cookies and respond with a 401 Unauthorized error
        if (error instanceof jwt.TokenExpiredError || error instanceof JsonWebTokenError) {
          clearTokensFromCookies(res);
          return res
            .status(401)
            .json(unauthorizedError.refreshToken);
        }
        //! If there's an unexpected error, log it and respond with a 500 Internal Server Error
        console.error(error);
        return res
          .status(500)
          .json(unauthorizedError.internalServerError);
      }
    }
  }
};

//TODO: Middleware function for checking the user role is 'admin' or not.
export const authAdmin = async (
  { payload: { role } }: Request,
  res: Response,
  next: NextFunction
) => {
  //? If the role is 'admin', continue with the next middleware function
  if (role === "admin") {
    return next();
  }
  //! If the user is not an admin, return a 403 Forbidden error
  res
    .status(403)
    .json(unauthorizedError.forbidden);
};


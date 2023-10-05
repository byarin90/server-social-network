// Imports necessary for middleware functionality
import { type Request, type Response, type NextFunction } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { clearTokensFromCookies, createJWT, saveAccessTokenOnCookie, saveRefreshTokenOnCookie } from '../utils/jwtUtil'
import RefreshToken from '../models/refreshTokenModel'
import { unauthorizedError } from '../lib/error-handling'
import { type IDecodedToken } from '../lib/@types/express/index'
import { SECRET } from '../constant/constant'
import logger from '../lib/logger'

// TODO: authenticateUser is a middleware for validating access and refresh JWT tokens, if access token is invalid,
// ? it tries to generate a new one using the refresh token.
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Get access and refresh tokens from cookies
  const accessToken = req.cookies.access_token
  const refreshToken = req.cookies.refresh_token

  //! If there's no access token, clear cookies and respond with a 401 Unauthorized error
  logger.debug('Checking for access token')
  if (!accessToken) {
    logger.debug('No access token found')
    clearTokensFromCookies(res)
    return res
      .status(401)
      .json(unauthorizedError.accessToken)
  }

  try {
    //! Verify the access token, if it's valid then assign the decoded payload to the request object and call next
    const decoded = jwt.verify(accessToken, SECRET.JWT_SECRET) as IDecodedToken
    req.payload = decoded
    next()
  } catch (error) {
    //! If there's no refresh token and the access token verification failed, clear cookies and respond with a 401 Unauthorized error
    if (!refreshToken) {
      clearTokensFromCookies(res)
      return res
        .status(401)
        .json(unauthorizedError.refreshToken)
    }

    //! If the error is because the token expired or it's invalid, try to create new tokens
    if (error instanceof jwt.TokenExpiredError || error instanceof JsonWebTokenError) {
      try {
        // TODO: Verify the refresh token, and if it's valid create new access and refresh tokens
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          SECRET.JWT_SECRET
        ) as IDecodedToken
        const newAccessToken = createJWT(
          decodedRefreshToken,
          SECRET.TTL_ACCESS_TOKEN
        )
        const newRefreshToken = createJWT(
          decodedRefreshToken,
          SECRET.TTL_REFRESH_TOKEN
        )

        // TODO: Update the stored refresh token in the database, if it's not found or can't be updated then clear cookies and respond with a 401 Unauthorized error
        const { matchedCount, modifiedCount } = await RefreshToken.updateOne(
          { user: decodedRefreshToken._id, token: refreshToken },
          { token: newRefreshToken }
        )

        if (!matchedCount && !modifiedCount) {
          clearTokensFromCookies(res)
          return res
            .status(401)
            .json(unauthorizedError.refreshToken)
        }

        // ? Save the newly created tokens in the cookies
        saveAccessTokenOnCookie(res, newAccessToken)
        saveRefreshTokenOnCookie(res, newRefreshToken)

        // ? Assign the decoded refresh token payload to the request object and call next
        req.payload = decodedRefreshToken
        next()
      } catch (error) {
        //! If the refresh token also expired or invalid, clear cookies and respond with a 401 Unauthorized error
        if (error instanceof jwt.TokenExpiredError || error instanceof JsonWebTokenError) {
          clearTokensFromCookies(res)
          return res
            .status(401)
            .json(unauthorizedError.refreshToken)
        }
        //! If there's an unexpected error, log it and respond with a 500 Internal Server Error
        console.error(error)
        return res
          .status(500)
          .json(unauthorizedError.internalServerError)
      }
    }
  }
}

// TODO: Middleware function for checking the user role is 'admin' or not.
export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.payload) {
    return res
      .status(401)
      .json({
        error: 'Unauthorized',
        message: 'You need to be logged in to access this route'
      })
  }

  const { role } = req.payload

  if (role === 'admin') {
    next()
  } else {
    res
      .status(403)
      .json(unauthorizedError.forbidden)
  }
}

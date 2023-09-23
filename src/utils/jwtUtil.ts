import jwt from 'jsonwebtoken'
import { type IDecodedToken } from '../lib/@types/express/index'
import { type Response } from 'express'
import { authConstant, SECRET } from '../constant/constant'
import { IUser } from '../lib/@types/db'

const createJWT = ({ _id, username, role }: IUser | IDecodedToken, expiresIn: number): string => {
  const token = jwt.sign({ _id, username, role }, SECRET.JWT_SECRET, { expiresIn: (expiresIn + 's') })
  return token
}

const saveRefreshTokenOnCookie = async (res: Response, refreshToken: string): Promise<void> => {
  res.cookie(authConstant.REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: 'strict'
  })
}

const saveAccessTokenOnCookie = async (res: Response, accessToken: string): Promise<void> => {
  res.cookie(authConstant.ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: 'strict'
  })
}

const clearTokensFromCookies = (res: Response): void => {
  res.clearCookie(authConstant.REFRESH_TOKEN_COOKIE)
  res.clearCookie(authConstant.ACCESS_TOKEN_COOKIE)
}

export { createJWT, saveRefreshTokenOnCookie, saveAccessTokenOnCookie, clearTokensFromCookies }

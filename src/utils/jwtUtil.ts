import jwt from 'jsonwebtoken';
import { IUser } from "../models/userModel";
import { SECRET } from '../configuration/secret';
import { IDecodedToken } from '../middlewares/middleware';
import { Response } from 'express';
import { authConstant } from '../constant/constant';

 const createJWT = ({_id,username,role}: IUser|IDecodedToken,expiresIn:number) => {    
    const token = jwt.sign({_id,username,role}, SECRET.JWT_SECRET, { expiresIn:(expiresIn+'s')});
    return token;
};


const saveRefreshTokenOnCookie = async (res:Response,refreshToken: string) => {
    res.cookie(authConstant.REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
};

const saveAccessTokenOnCookie = async (res:Response,accessToken: string) => {
    res.cookie(authConstant.ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        sameSite: "strict",
      });
}
const clearTokensFromCookies = (res: Response) => {
    res.clearCookie(authConstant.REFRESH_TOKEN_COOKIE);
    res.clearCookie(authConstant.ACCESS_TOKEN_COOKIE);
  };

export {createJWT,saveRefreshTokenOnCookie,saveAccessTokenOnCookie,clearTokensFromCookies};
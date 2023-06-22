import jwt from 'jsonwebtoken';
import { IUser } from "../models/userModel";
import { secret } from '../configuration/secret';
import { IDecodedToken } from '../middlewares/middleware';

export const createJWT = ({_id,username,role}: IUser|IDecodedToken,expiresIn:number) => {    
    const token = jwt.sign({_id,username,role}, secret.JWT_SECRET, { expiresIn:(expiresIn+'s')});
    return token;
};

import jwt from 'jsonwebtoken';
import { IUser } from "../models/userModel";
import { secret } from '../configuration/secret';

export const createJWT = ({_id,username,role}: IUser,expiresIn:number) => {    
    const token = jwt.sign({_id,username,role}, secret.JWT_SECRET, { expiresIn:(expiresIn+'s')});
    return token;
};

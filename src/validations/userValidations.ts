import { IUser } from "../models/userModel";
import { z } from "zod";

export const userValidation = {
  UserSchema: (bodyData: IUser) => {
    const schema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string(),
      profilePicture: z.string().url().optional(),
      bio: z.string().optional(),
    })  as z.ZodSchema<any>;;

    return schema.parse(bodyData);
  },
  LoginSchema: (bodyData: { identifier: string; password: string }) => {
    const schema = z.object({
      identifier: z.string(),
      password: z.string(),
    })  as z.ZodSchema<any>;;
    return schema.parse(bodyData);
  },
};

import { IUser } from "../models/userModel";
import { z } from 'zod';

const passwordSchema = z.string()
  .refine(password => /.{8,}$/.test(password), {
    message: "Password must be at least 8 characters long."
  })
  .refine(password => /(?=.*[a-z])/.test(password), {
    message: "Password must include at least one lowercase letter."
  })
  .refine(password => /(?=.*[A-Z])/.test(password), {
    message: "Password must include at least one uppercase letter."
  })
  .refine(password => /(?=.*\d)/.test(password), {
    message: "Password must include at least one number."
  })
  .refine(password => /(?=.*[_\W])/.test(password), {
    message: "Password must include at least one special character."
  });

export const userValidation = {
  UserSchema: (bodyData: IUser) => {
    const schema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: passwordSchema,
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

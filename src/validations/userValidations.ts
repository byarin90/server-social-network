import { z } from 'zod'
import { IUser } from '../lib/@types/db'

const passwordSchema = z.string()
  .refine(password => /.{8,}$/.test(password), {
    message: 'Password must be at least 8 characters long.'
  })
  .refine(password => /(?=.*[a-z])/.test(password), {
    message: 'Password must include at least one lowercase letter.'
  })
  .refine(password => /(?=.*[A-Z])/.test(password), {
    message: 'Password must include at least one uppercase letter.'
  })
  .refine(password => /(?=.*\d)/.test(password), {
    message: 'Password must include at least one number.'
  })
  .refine(password => /(?=.*[_\W])/.test(password), {
    message: 'Password must include at least one special character.'
  }).refine(password => password.length < 40, {
    message: 'Password must be less than 40 characters long.'
  })

export const userValidation = {
  UserSchema: (bodyData: IUser) => {
    const schema = z.object({
      firstName: z.string().max(30),
      lastName: z.string().max(30),
      username: z.string().max(30),
      email: z.string().email(),
      password: passwordSchema,
      profilePicture: z.string().url().optional(),
      bio: z.string().optional()
    }) as z.ZodSchema<any>

    return schema.parse(bodyData)
  },
  LoginSchema: (bodyData: { identifier: string, password: string }) => {
    const schema = z.object({
      identifier: z.string(),
      password: z.string()
    }) as z.ZodSchema<any>

    return schema.parse(bodyData)
  }
}

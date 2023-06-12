import { IPost } from "../models/postModel";
import { z } from 'zod';

export const postValidation = {
  CreatePostSchema: (bodyData: IPost) => {
    const schema = z.object({
      text: z.string(),
      image: z.string().optional(),
    })  as z.ZodSchema<any>;;

    return schema.parse(bodyData);
  },
};

import { IComment } from "../models/commentModel";
import { IPost } from "../models/postModel";
import { z } from 'zod';

export const postValidation = {
  CreatePostSchema: (bodyData: IPost) => {
    const schema = z.object({
      text: z.string(),
      image: z.string().optional(),
      videoLink: z.string().optional()
    })  as z.ZodSchema<any>;;

    return schema.parse(bodyData);
  },
  commentValidation: (bodyData: IComment) => {
    const schema = z.object({
      text: z.string(),
    })  as z.ZodSchema<any>;;

    return schema.parse(bodyData);
  }
};

import { Request, Response } from "express";
import Comment from "../models/commentModel";
import { IComment } from "../models/commentModel";
import Post, { IPost } from "../models/postModel";

const commentCtrl = {
    getAllComments: async (req: Request, res: Response) => {
        // TODO: Logic for getting all comments
        
    },

    createComment: async (req: Request, res: Response) => {
        // TODO: Logic for creating a comment for a specific post
    },

    getCommentById: async (req: Request, res: Response) => {
        // TODO: Logic for getting a comment by its id
    },

    updateComment: async (req: Request, res: Response) => {
        // TODO: Logic for updating a comment
    },

    deleteComment: async (req: Request, res: Response) => {
        // TODO: Logic for deleting a comment
    }, deleteOneCommentFromMyPost: async (req: Request, res: Response) => {
        const { postId, commentId } = req.params;
        const { _id } = req.payload;
        try {
          const post = await Post.findById(postId) as IPost & { comments: string[] };
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
    
          if (post.user != _id) {
            return res.status(401).json({ message: "Unauthorized" });
          }
    
        
          post.comments = post.comments.filter((comment:string) => comment != commentId);
          await post.save();
          res.status(200).json(post);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
}

export default commentCtrl;

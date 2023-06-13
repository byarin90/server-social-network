import { Request, Response } from "express";
import Comment from "../models/commentModel";
import { IComment } from "../models/commentModel";
import Post, { IPost } from "../models/postModel";
import { postValidation } from "../validations/postValidation";
import { z } from "zod";

const commentCtrl = {
    createComment: async (req: Request, res: Response) => {
        // TODO: Logic for creating a comment for a specific post
        const {postId} = req.params;
        const { _id } = req.payload;
        try {
          const validatation: IComment = postValidation.commentValidation(req.body)
          const post = await Post.findById(postId) as IPost & { comments: string[] };
          if (!post) {
            return res.status(404).json({ error: "Post not found" });
          }

          const comment = new Comment(validatation);
          comment.user = _id;
          comment.post = postId as string;
          await comment.save();
          post.comments.push(comment._id);
          await post.save();
          res.json(comment).status(201);
        }catch (error) {
          if(error instanceof z.ZodError) {
            return res.status(400).send({error: error.errors});
          }

          res.status(500).json({ error: error.message });
        }
    },
    updateComment: async (req: Request, res: Response) => {
        // TODO: Logic for updating a comment
        const {commentId} = req.params;
        const { _id } = req.payload;
        try{
          const comment = await Comment.findOne({_id: commentId});
          const validatation: IComment = postValidation.commentValidation(req.body)

          if(comment.user != _id) {
            return res.status(401).json({error: "Unauthorized"});
          }

          const updateComment = await Comment.updateOne({_id: commentId}, validatation);
          if(updateComment.matchedCount == 0) {
            return res.status(404).json({error: "Comment not found"});
          }else if(updateComment.modifiedCount == 0) {
            return res.status(304).json({error: "Comment not modified"});
          }else if(updateComment.modifiedCount == 1) {
            return res.status(200).json({message: "Comment updated"});
          }

        }catch(error){
          if(error instanceof z.ZodError) {
            return res.status(400).send({error: error.errors});
          }
          res.status(500).json({ error: error.message });
        }

    },

    deleteComment: async (req: Request, res: Response) => {
        // TODO: Logic for deleting a comment
        const {commentId} = req.params;
        const {postId} = req.query;
        const { _id } = req.payload;
        if(!postId) {
          return res.status(400).json({error: "postId is required"});
        }
        try{
          const post = await Post.findById(postId as string) as IPost & { comments: string[] };
          if (!post) {
            return res.status(404).json({ error: "Post not found" });
          }
          const comment = await Comment.findById(commentId);
          if(!comment) {
            return res.status(404).json({error: "Comment not found"});
          }
          if(comment.user != _id) {
            return res.status(401).json({error: "Unauthorized"});
          }
          post.comments = post.comments.filter((comment:string) => comment != commentId);
          await post.save();
          await comment.deleteOne();
          res.status(200).json({message: "Comment deleted"});

        }catch(error){
          res.status(500).json({ error: error.message });
        }
    }, deleteOneCommentFromMyPost: async (req: Request, res: Response) => {
        const { postId, commentId } = req.params;
        const { _id } = req.payload;
        try {
          const post = await Post.findById(postId) as IPost & { comments: string[] };
          if (!post) {
            return res.status(404).json({ error: "Post not found" });
          }
          
          if (post.user != _id) {
            return res.status(401).json({ error: "Unauthorized" });
          }
          
        
          post.comments = post.comments.filter((comment:string) => comment != commentId);
          await post.save();

          const comment = await Comment.deleteOne({_id:commentId});
          if (comment.deletedCount == 0) {
            return res.status(404).json({ error: "Comment not found" });
          }else if (comment.deletedCount == 1) {
            return res.status(200).json({ message: "Comment deleted" });
          }

          res.status(200).json({status: "ok"});
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
}

export default commentCtrl;

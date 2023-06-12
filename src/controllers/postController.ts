import { Request, Response } from "express";
import Post, { IPost } from "../models/postModel";
import { postValidation } from "../validations/postValidation";
import { z } from "zod";

const postCtrl = {
  getAllPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find()
        .populate("user", "firstName lastName profilePicture") // populate 'user' and select 'username' and 'profilePicture' fields
        .sort({ createdAt: -1 });

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate("user", "firstName lastName profilePicture") // populate 'user' and select 'username' and 'profilePicture' fields
        .sort({ createdAt: -1 });

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPostById: async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.postId)
        .populate("user", "firstName lastName profilePicture") // populate 'user' and select 'username' and 'profilePicture' fields
        .sort({ createdAt: -1 });

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPost: async (req: Request, res: Response) => {
    try {
      const validatedRequestBody: IPost = postValidation.CreatePostSchema(
        req.body
      );
      const post = new Post(validatedRequestBody);
      post.user = req.payload._id;
      await post.save();
      res.json(post).status(201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error
        return res.status(400).send({ error: error.errors });
      } else {
        // Other errors (like a database error)
        return res.status(500).send({ error: error });
      }
    }
  },

  updatePost: async (req: Request, res: Response) => {
    try {
      const validatedRequestBody: IPost = postValidation.CreatePostSchema(
        req.body
      );
      const post = await Post.findByIdAndUpdate(
        req.params.postId,
        validatedRequestBody,
        { new: true }
      );
      res.json(post).status(200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error
        return res.status(400).send({ error: error.errors });
      } else {
        // Other errors (like a database error)
        return res.status(500).send({ error: error });
      }
    }
  },

  deletePost: async (req: Request, res: Response) => {
    try {
      const post = await Post.deleteOne({ _id: req.params.postId });
      if (post.deletedCount === 0) {
        return res.status(404).json({ message: "Post not found" });
      } else if (post.deletedCount === 1) {
        return res.status(200).json({ message: "Post deleted" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteCommentFromPost: async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { _id } = req.payload;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.user != _id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const comment = post.comments.find((comment) => comment == commentId) as any;
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const index = post.comments.indexOf(comment);
      post.comments.splice(index, 1);
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default postCtrl;

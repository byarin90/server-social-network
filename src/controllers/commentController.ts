import { Request, Response } from 'express'
import { postValidation } from '../validations/postValidation'
import { z } from 'zod'
import { IDecodedToken } from '../lib/@types/express/index'
import { IComment, IPost } from '../lib/@types/db'
import Post from '../models/postModel'
import Comment from '../models/commentModel'
const commentCtrl = {
  // Function to create a comment for a specific post
  createComment: async (req: Request, res: Response) => {
    const { postId } = req.params // Get post ID from parameters

    const { _id } = req.payload as IDecodedToken // Get user ID from request payload

    try {
      // Validate request body using postValidation
      const validatation: IComment = postValidation.commentValidation(req.body)

      // Find the post by ID
      const post = await Post.findById(postId) as IPost & { comments: string[] }
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      // Create a new comment with the validated data
      const comment = new Comment(validatation)
      comment.user = _id // Assign user ID to comment
      comment.post = postId // Assign post ID to comment
      await comment.save() // Save comment

      post.comments.push(comment._id) // Push the comment ID into the post's comments
      await post.save() // Save post

      // Return the saved comment
      res.json(comment).status(201)
    } catch (error: any) {
      // Check if the error is an instance of ZodError
      if (error instanceof z.ZodError) {
        return res.status(400).send({ error: error.errors })
      }

      // If not, return the error message
      res.status(500).json({ error: error.message })
    }
  },

  // Function to update a comment
  updateComment: async (req: Request, res: Response) => {
    const { commentId } = req.params // Get comment ID from parameters
    const { _id } = req.payload as IDecodedToken // Get user ID from request payload

    try {
      // Find comment by ID
      const comment = await Comment.findOne({ _id: commentId })

      // Validate request body using postValidation
      const validatation: IComment = postValidation.commentValidation(req.body)

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' })
      }

      // Check if the user is authorized to update the comment
      if (comment.user !== _id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Update the comment with the validated data
      const updateComment = await Comment.updateOne({ _id: commentId }, validatation)

      // Check if the comment was found, not modified or updated
      if (updateComment.matchedCount === 0) {
        return res.status(404).json({ error: 'Comment not found' })
      } else if (updateComment.modifiedCount === 0) {
        return res.status(304).json({ error: 'Comment not modified' })
      } else if (updateComment.modifiedCount === 1) {
        return res.status(200).json({ message: 'Comment updated' })
      }
    } catch (error: any) {
      // Check if the error is an instance of ZodError
      if (error instanceof z.ZodError) {
        return res.status(400).send({ error: error.errors })
      }

      // If not, return the error message
      res.status(500).json({ error: error.message })
    }
  },

  // Function to delete a comment
  deleteComment: async (req: Request, res: Response) => {
    const { commentId } = req.params // Get comment ID from parameters
    const { postId } = req.query // Get post ID from query
    const { _id } = req.payload as IDecodedToken // Get user ID from request payload

    // Check if postId is provided in the query
    if (!postId) {
      return res.status(400).json({ error: 'postId is required' })
    }

    try {
      // Find the post by ID
      const post = await Post.findById(postId as string) as IPost & { comments: string[] }
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      // Find comment by ID
      const comment = await Comment.findById(commentId)

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' })
      }

      // Check if the user is authorized to delete the comment
      if (comment.user !== _id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Filter the post's comments to remove the deleted comment
      post.comments = post.comments.filter((comment: string) => comment !== commentId)
      await post.save() // Save post

      // Delete comment
      await comment.deleteOne()

      // Return success message
      res.status(200).json({ message: 'Comment deleted' })
    } catch (error: any) {
      // Return the error message
      res.status(500).json({ error: error.message })
    }
  },

  // Function to delete a comment from user's own post
  deleteOneCommentFromMyPost: async (req: Request, res: Response) => {
    const { postId, commentId } = req.params // Get post ID and comment ID from parameters
    const { _id } = req.payload as IDecodedToken // Get user ID from request payload

    try {
      // Find the post by ID
      const post = await Post.findById(postId) as IPost & { comments: string[] }
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      // Check if the user is authorized to delete the comment
      if (post.user !== _id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Filter the post's comments to remove the deleted comment
      post.comments = post.comments.filter((comment: string) => comment !== commentId)
      await post.save() // Save post

      // Delete comment
      const comment = await Comment.deleteOne({ _id: commentId })

      // Check if the comment was found and deleted
      if (comment.deletedCount === 0) {
        return res.status(404).json({ error: 'Comment not found' })
      } else if (comment.deletedCount === 1) {
        return res.status(200).json({ message: 'Comment deleted' })
      }

      // Return success status
      res.status(200).json({ status: 'ok' })
    } catch (error: any) {
      // Return the error message
      res.status(500).json({ error: error.message })
    }
  }
}

export default commentCtrl

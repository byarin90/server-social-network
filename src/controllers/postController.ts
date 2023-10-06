import { type Request, type Response } from 'express'
import Post from '../models/postModel'
import { postValidation } from '../validations/postValidation'
import { z } from 'zod'
import { User } from '../models/userModel'
import { type IDecodedToken } from '../lib/@types/express/index'
import { IPost } from '../lib/@types/db'
import logger from '../lib/logger'

const postCtrl = {
  getFriendsPosts: async (req: Request, res: Response) => {
    logger.debug('get friends posts')
    // Get the user id from the request payload
    const { _id } = req.payload as IDecodedToken

    try {
      // Fetch the user's User document
      const user = await User.findById(_id)

      if (!user) return res.status(404).json({ error: 'User not found' })
      // Extract the list of friend IDs and include the user's own id
      const friendsIds = [...user.friends, _id]

      // Find posts created by the user or any of their friends
      const posts = await Post.find({
        user: { $in: friendsIds }
      })
        .populate({
          path: 'user',
          select: 'firstName lastName profilePicture'
        })
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'firstName lastName profilePicture'
          }
        })
        .sort({ createdAt: -1 })

      if (!posts.length) {
        return res.status(400).json({ error: 'No posts found' })
      }
      res.status(200).json(posts)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  getUserPosts: async (req: Request, res: Response) => {
    logger.debug('get user posts')
    try {
      const posts = await Post.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName profilePicture') // populate 'user' and select 'username' and 'profilePicture' fields
        .sort({ createdAt: -1 })
        .populate('comments')

      res.status(200).json(posts)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  getPostById: async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.postId)
        .populate('user', 'firstName lastName profilePicture') // populate 'user' and select 'username' and 'profilePicture' fields
        .sort({ createdAt: -1 })
        .populate('comments')
      if (!post) return res.status(404).json({ error: 'Post not found' })

      return res.status(200).json(post)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  createPost: async (req: Request, res: Response) => {
    try {
      const validatedRequestBody: IPost = postValidation.CreatePostSchema(
        req.body
      )
      const post = new Post(validatedRequestBody)
      const { _id } = req.payload as IDecodedToken
      post.user = _id
      await post.save()
      res.json(post).status(201)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error
        return res.status(400).send({ error: error.errors })
      } else {
        // Other errors (like a database error)
        return res.status(500).send({ error })
      }
    }
  },

  updatePost: async (req: Request, res: Response) => {
    try {
      const validatedRequestBody: IPost = postValidation.CreatePostSchema(
        req.body
      )
      const post = await Post.findByIdAndUpdate(
        req.params.postId,
        validatedRequestBody,
        { new: true }
      )
      if (!post) return res.status(404).json({ error: 'Post not found' })
      res.json(post).status(200)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error
        return res.status(400).send({ error: error.errors })
      } else {
        // Other errors (like a database error)
        return res.status(500).send({ error })
      }
    }
  },

  deletePost: async (req: Request, res: Response) => {
    try {
      const post = await Post.deleteOne({ _id: req.params.postId })
      if (post.deletedCount === 0) {
        return res.status(404).json({ error: 'Post not found' })
      } else if (post.deletedCount === 1) {
        return res.status(200).json({ message: 'Post deleted' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default postCtrl

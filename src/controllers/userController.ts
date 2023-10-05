import { Request, Response } from 'express'
import { User } from '../models/userModel'
import { IDecodedToken } from '../lib/@types/express/index'
import jwt from 'jsonwebtoken'
import { SECRET } from '../constant/constant'
import { IUser } from '../lib/@types/db'
import logger from '../lib/logger'

const userCtrl = {
  getProfileById: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const user = await User.findById(id).select('-password -refreshToken  -updatedAt -__v')
      if (!user?.isActive) return res.status(400).json({ msg: 'User does not exist.' })
      res.json(user)
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  getProfile: async (req: Request, res: Response) => {
    const { _id } = req.payload as IDecodedToken
    console.log(_id)
    try {
      const user = await User.findById(_id).select('-password -refreshToken  -updatedAt -__v')
      if (!user) return res.status(400).json({ msg: 'User does not exist.' })
      res.json(user)
    } catch (err: any) {
      console.log(err)
      return res.status(500).json({ msg: err.message })
    }
  },
  createWsToken: async (req: Request, res: Response) => {
    try {
      logger.debug('Creating WS token')
      const { _id } = req.payload as IDecodedToken

      logger.debug(`Creating WS token for user ${_id}`)
      const { username } = await User.findOne({ _id }).select('username') as IUser
      // Set the token to expire after a short duration (e.g., 5 minutes)
      const expiresIn = 5 * 60
      logger.debug(`Creating WS token for user ${username} with expiration ${expiresIn}`)
      const wsToken = jwt.sign({ username }, SECRET.JWT_SECRET, { expiresIn })
      res.json({ wsToken })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default userCtrl

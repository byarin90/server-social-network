import { Request, Response } from 'express'
import { User } from '../models/userModel'
import { IDecodedToken } from '../lib/@types/express/index'

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
  }
}

export default userCtrl

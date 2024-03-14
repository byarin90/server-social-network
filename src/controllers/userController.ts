import { Request, Response } from 'express'
import { User } from '../models/userModel'
import { IDecodedToken } from '../lib/@types/express/index'
import jwt from 'jsonwebtoken'
import { SECRET } from '../constant/constant'
import { IUser } from '../lib/@types/db'
import logger from '../lib/logger'
import { StandardError } from '../utils/error-handling'
import { s3Client } from '../lib/aws-client'
import { v4 as uuidv4 } from 'uuid'

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
      const expiresIn = '1d'
      logger.debug(`Creating WS token for user ${username} with expiration ${expiresIn}`)
      const wsToken = jwt.sign({ username }, SECRET.JWT_SECRET, { expiresIn })
      res.json({ wsToken })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  uploadImage: async (req: Request, res: Response) => {
    try {
      const imageId = uuidv4()
      const requestFile = (req as any).files as Express.Multer.File[]

      if (!requestFile || requestFile.length === 0) {
        throw new StandardError('No file provided', 'NO_FILE_PROVIDED', 400)
      }
      const file = requestFile[0]
      logger.info('Uploading image', { file: file.originalname })

      const path = `socialNetwork/profileImages/${imageId}#${file.originalname}`
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: SECRET.S3_BUCKET_NAME,
        Key: path,
        Body: file.buffer,
        ContentType: 'image/jpeg'
      }

      s3Client.upload(uploadParams, (err, data) => {
        if (err) {
          logger.error('Error', err)
          throw new StandardError('Error uploading file', 'UPLOAD_ERROR', 500)
        }

        if (data) {
          logger.info('Image Upload Success', { url: data.Location })
          return res.json({ url: data.Location })
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default userCtrl

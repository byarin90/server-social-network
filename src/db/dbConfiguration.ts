import mongoose from 'mongoose'
import { SECRET } from '../constant/constant'
import logger from '../lib/logger'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(SECRET.DB_URI)

    logger.debug('Connected successfully to MongoDB')
  } catch (error) {
    logger.error('Error connecting to database: ', error)
  }
}

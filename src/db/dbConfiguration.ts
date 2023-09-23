import mongoose from 'mongoose'
import { SECRET } from '../constant/constant'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(SECRET.DB_URI)

    console.log('Connected successfully to database')
  } catch (error) {
    console.error('Error connecting to database: ', error)
  }
}

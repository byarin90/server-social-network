import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IUser } from '../lib/@types/db'

const chatSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }
})

export const User = mongoose.model<IUser>('Chat', chatSchema)

import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IMessage } from '../lib/@types/db'

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }

})

export default mongoose.model<IMessage>('Message', MessageSchema)

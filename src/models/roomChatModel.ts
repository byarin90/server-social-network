import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IRoomChat } from '../lib/@types/db'

const roomChatSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }
})

export default mongoose.model<IRoomChat>('RoomChat', roomChatSchema)

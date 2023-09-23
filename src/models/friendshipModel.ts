import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IFriendship } from '../lib/@types/db'

const FriendshipSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending',
    required: true
  },
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }

})

export default mongoose.model<IFriendship>('Friendship', FriendshipSchema)

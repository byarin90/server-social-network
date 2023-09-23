import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IComment } from '../lib/@types/db'

const CommentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }

})

export default mongoose.model<IComment>('Comment', CommentSchema)

import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IPost } from '../lib/@types/db'

const PostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String },
  videoLink: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }

})

export default mongoose.model<IPost>('Post', PostSchema)

// RefreshToken Interface
import mongoose, { Schema } from 'mongoose'
import { dateNow } from '../utils/date'
import { IRefreshToken } from '../lib/@types'

// RefreshToken Schema
const RefreshTokenSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  created_at: { type: Date, default: dateNow() },
  updated_at: { type: Date, default: dateNow() }
})

// TTL Index for RefreshToken

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema)

// RefreshToken Interface
import mongoose, { Schema, Document } from 'mongoose';
import { secret } from '../configuration/secret';
import { IUser } from './userModel';
import { dateNow } from '../utils/date';

export interface IRefreshToken extends Document {
    user: string | IUser;
    token: string;
  }
  
  // RefreshToken Schema
  const RefreshTokenSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    created_at: { type: Date, default: dateNow() },
    updated_at: { type: Date, default: dateNow() }

  });
  
  // TTL Index for RefreshToken
  
  export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
  
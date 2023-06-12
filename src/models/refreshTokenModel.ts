// RefreshToken Interface
import mongoose, { Schema, Document } from 'mongoose';
import { secret } from '../configuration/secret';
import { IUser } from './userModel';

export interface IRefreshToken extends Document {
    user: string | IUser;
    token: string;
  }
  
  // RefreshToken Schema
  const RefreshTokenSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    
  }, { timestamps: { createdAt: 'created_at' } });
  
  // TTL Index for RefreshToken
  RefreshTokenSchema.index({ created_at: 1 }, { expireAfterSeconds: secret.TTL_REFRESH_TOKEN });
  
  export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
  
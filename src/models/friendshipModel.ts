import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';
import { dateNow } from '../utils/date';

export interface IFriendship extends Document {
    sender: string | IUser;
    receiver: string | IUser;
    status:'pending' | 'accepted' | 'declined'| 'blocked' ;
    timestamp: Date;
}

const FriendshipSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined','blocked'], 
        default: 'pending',
        required: true 
    },
    created_at: { type: Date, default: dateNow() },
    updated_at: { type: Date, default: dateNow() }

});

export default mongoose.model<IFriendship>('Friendship', FriendshipSchema);

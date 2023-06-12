import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IFriendship extends Document {
    sender: string | IUser;
    receiver: string | IUser;
    status:'pending' | 'accepted' | 'declined' ;
    timestamp: Date;
}

const FriendshipSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined'], 
        default: 'pending',
        required: true 
    },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IFriendship>('Friendship', FriendshipSchema);

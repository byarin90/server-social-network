import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';
import { IComment } from './commentModel';
import { dateNow } from '../utils/date';
    
export interface IPost extends Document {
    user: string | IUser;
    text: string;
    image: string;
    videoLink: string;
    likes: string[] | IUser[];
    comments: string[] | IComment[];
}

const PostSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image: { type: String },
    videoLink: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    created_at: { type: Date, default: dateNow() },
    updated_at: { type: Date, default: dateNow() }

});

export default mongoose.model<IPost>('Post', PostSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';
import { IComment } from './commentModel';

export interface IPost extends Document {
    user: string | IUser;
    text: string;
    image: string;
    likes: string[] | IUser[];
    comments: string[] | IComment[];
}

const PostSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);

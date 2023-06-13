import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';
import { IPost } from './postModel';

export interface IComment extends Document {
    user: string |IUser;
    post: string |IPost;
    text: string;
    likes: string[] | IUser[];
}

const CommentSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', CommentSchema);

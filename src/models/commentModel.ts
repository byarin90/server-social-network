import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    user: string;
    post: string;
    text: string;
    likes: string[];
}

const CommentSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', CommentSchema);

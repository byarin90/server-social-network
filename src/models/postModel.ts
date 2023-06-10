import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    user: string;
    text: string;
    image: string;
    likes: string[];
    comments: string[];
}

const PostSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);

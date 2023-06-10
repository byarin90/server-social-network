import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: string;
    receiver: string;
    text: string;
}

const MessageSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);

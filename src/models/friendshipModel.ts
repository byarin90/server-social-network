import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: string;
    receiver: string;
    content: string;
    timestamp: Date;
}

const MessageSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('Message', MessageSchema);

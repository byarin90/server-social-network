import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    role: string;
    isActive: boolean;
    friends: string[];
    friendRequestsSent: string[];
    friendRequestsReceived: string[];
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String , required: true},
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'Friendship' }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'Friendship' }],
}, { timestamps: true });
UserSchema.index({ username: 1, email: 1 }, { unique: true });
export const User= mongoose.model<IUser>('User', UserSchema);

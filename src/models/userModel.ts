import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    role: { type: String, default: 'user' },
});

export const User= mongoose.model<IUser>('User', UserSchema);

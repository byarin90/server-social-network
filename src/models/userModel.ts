import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    role: string;
    refreshToken?: string;
    isActive: boolean;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    role: { type: String, default: 'user' },
    refreshToken: { type: String, default: null },
    isActive: { type: Boolean, default: true } // Add this line
}, { timestamps: true });

export const User= mongoose.model<IUser>('User', UserSchema);

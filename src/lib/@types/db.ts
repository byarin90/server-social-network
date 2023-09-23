import { type Document } from 'mongoose'

export interface IComment extends Document {
  user: string | IUser
  post: string | IPost
  text: string
  likes: string[] | IUser[]
}

export interface IFriendship extends Document {
  sender: string | IUser
  receiver: string | IUser
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  timestamp: Date
}

export interface IMessage extends Document {
  sender: string | IUser
  receiver: string | IUser
  text: string
}

export interface IPost extends Document {
  user: string | IUser
  text: string
  image: string
  videoLink: string
  likes: string[] | IUser[]
  comments: string[] | IComment[]
}

export interface IUser extends Document {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  profilePicture: string
  bio: string
  role: string
  isActive: boolean
  friends: string[]
  friendRequestsSent: string[]
  friendRequestsReceived: string[]
};

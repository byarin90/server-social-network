import { Socket } from 'socket.io'
import { IUser } from './db'

export interface IRefreshToken extends Document {
  user: string | IUser
  token: string
}

export interface IUserSocket {
  username: string
  firstName: string
  lastName: string
  email: string
  profilePicture: string
}
export interface IExtendedSocket extends Socket {
  user: IUserSocket
}

import { IUser } from './db'

export interface IRefreshToken extends Document {
  user: string | IUser
  token: string
}

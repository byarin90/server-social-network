// ? This is a type definition for the payload of the JWT
export interface IDecodedToken {
  _id: string
  username: string
  role: 'user' | 'admin'
  iat: number
  exp: number
}

// ? This is a modification of the Express.Request interface to include payload, used below in authenticateUser
declare global {
  namespace Express {
    interface Request {
      payload?: IDecodedToken
    }
  }
}

// socket.ts
import { Server as SocketIoServer, Socket } from 'socket.io'
import logger from '../logger'
import jwt from 'jsonwebtoken'
import { SECRET } from '../../constant/constant'
const validateToken = (token: string): string | null => {
  try {
    const { username } = jwt.verify(token, SECRET.JWT_SECRET) as any
    return username
  } catch (err: any) {
    return null
  }
}

const createSocket = (server: any): void => {
  try {
    const io = new SocketIoServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    interface extendedSocket extends Socket {
      username: string
    }
    io.use((socket, next) => {
      const token = socket.handshake.auth.token
      const username = validateToken(token)
      if (username?.length) {
        (socket as extendedSocket).username = username
        next()
      } else {
        socket.emit('message', {
          roomName: 'system',
          message: 'You are not authenticated. Please log in.'
        })
        next(new Error('Authentication error'))
      }
    })

    io.on('connection', (socket) => {
      // Join Room/
      socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName)
      })

      // Handle incoming messages within the room
      // Server-side code snippet
      socket.on('chatMessage', (roomName: string, message: string) => {
        io.to(roomName).emit('message', { roomName, message, username: (socket as extendedSocket).username }) // Emitting both roomName and message
      })
    })
  } catch (err: any) {
    logger.error(err)
  }
}

export default createSocket

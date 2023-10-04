// socket.ts
import { Server as SocketIoServer } from 'socket.io'
import logger from '../logger'

const createSocket = (server: any): void => {
  try {
    const io = new SocketIoServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', (socket) => {
      logger.debug('User connected:', { socketId: socket.id })

      // Join Room
      socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName)
        logger.debug(`User ${socket.id} joined room ${roomName}`)
      })

      // Handle incoming messages within the room
      // Server-side code snippet
      socket.on('chatMessage', (roomName: string, message: string) => {
        io.to(roomName).emit('message', { roomName, message }) // Emitting both roomName and message
      })
    })
  } catch (err: any) {
    logger.error(err)
  }
}

export default createSocket

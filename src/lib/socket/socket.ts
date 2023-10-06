// socket.ts
import { Server as SocketIoServer } from 'socket.io'
import logger from '../logger'
import { User } from '../../models/userModel'
import chatCtrl from '../../controllers/chatController'
import { validateSocketIOToken } from '../../middlewares/middleware'
import { IExtendedSocket, IUserSocket } from '../@types'

const createSocket = (server: any): void => {
  try {
    const io = new SocketIoServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        const username = validateSocketIOToken(token)
        if (username?.length) {
          const userSocket = await User.findOne({ username }).select('username firstName lastName email profilePicture').lean() as IUserSocket
          (socket as IExtendedSocket).user = userSocket
          next()
        } else {
          next(new Error('Authentication error'))
        }
      } catch (err: any) {
        next(new Error('socket_error'))
      }
    })

    io.on('connection', (socket) => {
      // Join Room//
      socket.on('joinRoom', async (roomId: string) => {
        socket.join(roomId)
      })

      socket.on('chatMessage', async (data: string) => {
        const { message, roomId } = await chatCtrl.newMessage(data)
        io.to(roomId).emit('message', { roomId, message, username: (socket as IExtendedSocket).user.username }) // Emitting both roomId and message
      })
    })
  } catch (err: any) {
    logger.error(err)
  }
}

export default createSocket

import { type Request, type Response } from 'express'
import RoomChat from '../models/roomChatModel'
import { User } from '../models/userModel'
import Message from '../models/messageModel'
import logger from '../lib/logger'

const chatCtrl = {
  getRoomChat: async (req: Request, res: Response) => {
    logger.debug('get room chat')
    const { username } = req.params
    const receiver = await User.findOne({ username })
    logger.debug('check receiver exists')
    if (!receiver) return res.status(400).json({ err: 'User does not exist for chat.' })

    logger.debug('check receiver is friend')
    if (!receiver.friends.includes(req.payload?._id as string)) {
      return res.status(400).json({
        err: 'You can only chat with your friends.'
      })
    }

    try {
      logger.debug('find room chat')
      const roomChat = await RoomChat.findOne({
        $or: [
          { sender: receiver._id, receiver: req.payload?._id },
          { sender: req.payload?._id, receiver: receiver._id }
        ]
      })
        .populate({
          path: 'messages',
          populate: [
            {
              path: 'sender',
              select: 'username firstName lastName profilePicture'
            },
            {
              path: 'receiver', // Add this to populate the receiver
              select: 'username firstName lastName profilePicture'
            }
          ],
          options: {
            sort: { createdAt: -1 }
          }
        })

      logger.debug('check room chat exists')
      if (!roomChat) {
        logger.debug('create new room chat')
        const newRoomChat = new RoomChat({
          sender: req.payload?._id,
          receiver: receiver._id
        })
        await newRoomChat.save()

        const newRoom = await RoomChat.findById(newRoomChat._id)
          .populate({
            path: 'sender',
            select: 'username firstName lastName profilePicture'
          }).populate({
            path: 'receiver',
            select: 'username firstName lastName profilePicture'
          })
        logger.debug('room chat created')
        return res.json(newRoom)
      }

      res.json(roomChat)
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  newMessage: async (_data: string) => {
    const data = JSON.parse(_data) as { message: string, receiverId: string, roomId: string, senderId: string }
    const { message, receiverId, roomId, senderId } = data
    const room = await RoomChat.findOne({ _id: roomId }) as any
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      messeage: message
    })

    await newMessage.save()
    await room.messages.push(newMessage._id)
    await room.save()

    return data
  }
}

export default chatCtrl

import { type Request, type Response } from 'express'
import RoomChat from '../models/roomChatModel'
import { User } from '../models/userModel'

const chatCtrl = {
  getRoomChat: async (req: Request, res: Response) => {
    const { username } = req.params
    const receiver = await User.findOne({ username })
    if (!receiver) return res.status(400).json({ err: 'User does not exist for chat.' })

    if (!receiver.friends.includes(req.payload?._id as string)) {
      return res.status(400).json({
        err: 'You can only chat with your friends.'
      })
    }

    try {
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

      if (!roomChat) {
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
        return res.json(newRoom)
      }

      res.json(roomChat)
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default chatCtrl

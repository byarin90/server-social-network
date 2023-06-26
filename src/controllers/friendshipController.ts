import { Request, Response } from "express";
import { User } from "../models/userModel";
import FriendshipModel from "../models/friendshipModel";

export const friendshipCtrl = {
  createFriendshipRequest: async (req: Request, res: Response) => {
    // Get sender's id from the request payload
    const { _id } = req.payload;
    // Get receiver's id from the request parameters
    const { id: userId } = req.params;

    try {
      // Fetch the receiver's User document
      const user = await User.findById(userId);
      // If the User doesn't exist or is not active, return error
      if (!user || !user.isActive)
        return res.status(400).json({ msg: "User does not exist." });

      // Check if a friendship document already exists between the sender and the receiver
      let isFriendShip = await FriendshipModel.findOne({
        $or: [
          { sender: _id, receiver: userId },
          { sender: userId, receiver: _id },
        ],
      });

      // If a friendship document does not exist
      if (!isFriendShip) {
        // Create a new friendship document with status pending
        const newFriendshipRequest = await FriendshipModel.create({
          sender: _id,
          receiver: userId,
        });

        // Update the sender's User document, add the new Friendship's id to friendRequestsSent array
        await User.findByIdAndUpdate(_id, { $push: { friendRequestsSent: newFriendshipRequest._id } });

        // Update the receiver's User document, add the new Friendship's id to friendRequestsReceived array
        await User.findByIdAndUpdate(userId, { $push: { friendRequestsReceived: newFriendshipRequest._id } });

        // Return the new Friendship document
        return res.json(newFriendshipRequest);
      }

      // If the existing Friendship's status is pending
      if (isFriendShip.status === "pending") {
        // If the sender was the one who initiated the pending request, return error
        if(isFriendShip.sender.toString() === _id) {
          return res.status(400).json({ msg: "Friendship request is pending approval." });
        }

        // If the receiver was the one who initiated the pending request
        if(isFriendShip.sender.toString() === userId) {
          // Change the status of the Friendship to accepted
          isFriendShip.status = "accepted";
          // Save the updated Friendship document
          await isFriendShip.save();
          // Return success message
          return res.status(200).json({ msg: "Friendship request accepted." });
        }
      }

      // If the existing Friendship's status is accepted, return error
      if (isFriendShip.status === "accepted") {
        return res.status(400).json({ msg: "You are already friends." });
      }

      // If the existing Friendship's status is declined
      if(isFriendShip.status === "declined") {
        // If the sender was the one who initiated the declined request
        if(isFriendShip.sender.toString() === _id) {
          // Change the status of the Friendship to pending
          isFriendShip.status = "pending";
          // Save the updated Friendship document
          await isFriendShip.save();
          // Return success message
          return res.status(200).json({ msg: "Friendship request sent." });
        }

        // If the receiver was the one who initiated the declined request, return error
        if(isFriendShip.sender.toString() === userId) {
          return res.status(400).json({ msg: "Friendship request is pending approval." });
        }
      }
    } catch (err) {
      // In case of any error, return error message
      return res.status(500).json({ error: err.message });
    }
  },getSentFriendshipRequests: async ({payload:{_id}}: Request, res: Response) => {

    try{
      const sentFriendshipRequests = await FriendshipModel.find({sender: _id, status: 'pending'}).populate({
        path: 'receiver',
        select: 'firstName lastName username profilePicture'
      }); 

      if(!sentFriendshipRequests.length) {
        return res.status(400).json({msg: 'No friendship requests sent.'});
      }

      return res.json(sentFriendshipRequests);

    }catch(err) {
      return res.status(500).json({ error: err.message });
    }
  },getReceivedFriendshipRequests: async ({payload:{_id}}: Request, res: Response) => {
      try{
        const receivedFriendshipRequests = await FriendshipModel.find({receiver: _id, status: 'pending'}).populate({
          path: 'sender',
          select: 'firstName lastName username profilePicture'
        }); 

        if(!receivedFriendshipRequests.length) {
          return res.status(400).json({msg: 'No friendship requests received.'});
        }

        return res.json(receivedFriendshipRequests);
      }catch(err) {
        return res.status(500).json({ error: err.message });
      }
  },acceptFriendshipRequest: async ({payload:{_id}, params:{id}}: Request, res: Response) => {
    try{
      // Find the pending friendship request between the two users
      const friendshipRequest = await FriendshipModel.findOne({sender: id, receiver: _id, status: 'pending'});

      // If no such request is found, return an error
      if(!friendshipRequest) {
        return res.status(400).json({msg: 'Friendship request not found.'});
      }

      // Set the status of the friendship request to accepted
      friendshipRequest.status = 'accepted';
      // Save the updated friendship request
      await friendshipRequest.save();

      // Remove the friendship request from the received and sent friend request lists of the respective users
      await User.findByIdAndUpdate(_id, { $pull: { friendRequestsReceived: friendshipRequest._id } });
      await User.findByIdAndUpdate(id, { $pull: { friendRequestsSent: friendshipRequest._id } });

      // Add the other user's ID to the friends list of both users
      await User.findByIdAndUpdate(_id, { $push: { friends: id } });
      await User.findByIdAndUpdate(id, { $push: { friends: _id } });

      // Return a success message
      return res.json({msg: 'Friendship request accepted.'});
    } catch(err) {
      // In case of any error, return an error message
      return res.status(500).json({ error: err.message });
    }
  }

};

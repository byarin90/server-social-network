import express, { Request, Response, Router } from 'express'
import { authenticateUser } from '../middlewares/middleware'
import authCtrl from '../controllers/authController'
import userCtrl from '../controllers/userController'
import { friendshipCtrl } from '../controllers/friendshipController'
import chatCtrl from '../controllers/chatController'
import { uploadFile } from '../utils/upload-file'

const router = express.Router() as Router

router.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Users is up!' })
})

// ?Authentification
router.post('/register', authCtrl.signUp)
router.post('/login', authCtrl.login)
router.post('/logout', authenticateUser, authCtrl.logout)
router.get('/protected', authenticateUser, authCtrl.protected)
router.patch('/isActive', authenticateUser, authCtrl.isActiveToggle)

// ? profile
router.get('/myProfile', authenticateUser, userCtrl.getProfile)
router.post('/wsToken', authenticateUser, userCtrl.createWsToken)

router.post('/upload-profile-image', uploadFile, userCtrl.uploadImage)
router.get('/:id', authenticateUser, userCtrl.getProfileById)

// ? Friendship Routes
// Create Friendship Request
router.post('/friendship/request/:id', authenticateUser, friendshipCtrl.createFriendshipRequest)
// This route allows a user to send a friendship request to another user.

// Get Sent Friendship Requests
router.get('/friendship/requests/sent', authenticateUser, friendshipCtrl.getSentFriendshipRequests)
// This route retrieves the list of sent friendship requests by the authenticated user.

// Get Friendship Requests
router.get('/friendship/requests/received', authenticateUser, friendshipCtrl.getReceivedFriendshipRequests)
// This route retrieves the list of received friendship requests by the authenticated user.
// The request status is pending in this case.

// Accept Friendship Request
router.patch('/friendship/accept/:id', authenticateUser, friendshipCtrl.acceptFriendshipRequest)
// This route allows a user to accept a pending friendship request.

// Decline Friendship Request
router.patch('/friendship/decline/:id', authenticateUser, friendshipCtrl.declineFriendshipRequest)
// This route allows a user to decline a pending friendship request.

// Cancel Friendship Request
router.patch('/friendship/cancel/:id', authenticateUser, friendshipCtrl.cancelFriendshipRequest)
// This route allows a user to cancel a sent friendship request.

// Unfriend User
router.patch('/friendship/unfriend/:id', authenticateUser, friendshipCtrl.unfriendUser)
// This route allows a user to unfriend another user.

// Get Friends
router.get('/friendship/friends', authenticateUser, friendshipCtrl.getFriends)
// This route retrieves the list of friends for the authenticated user.
router.get('/chat/:username', authenticateUser, chatCtrl.getRoomChat)
export default router

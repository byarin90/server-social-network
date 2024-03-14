"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const authController_1 = __importDefault(require("../controllers/authController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const friendshipController_1 = require("../controllers/friendshipController");
const chatController_1 = __importDefault(require("../controllers/chatController"));
const upload_file_1 = require("../utils/upload-file");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ msg: 'Users is up!' });
});
// ?Authentification
router.post('/register', authController_1.default.signUp);
router.post('/login', authController_1.default.login);
router.post('/logout', middleware_1.authenticateUser, authController_1.default.logout);
router.get('/protected', middleware_1.authenticateUser, authController_1.default.protected);
router.patch('/isActive', middleware_1.authenticateUser, authController_1.default.isActiveToggle);
// ? profile
router.get('/myProfile', middleware_1.authenticateUser, userController_1.default.getProfile);
router.post('/wsToken', middleware_1.authenticateUser, userController_1.default.createWsToken);
router.post('/upload-profile-image', upload_file_1.uploadFile, userController_1.default.uploadImage);
router.get('/:id', middleware_1.authenticateUser, userController_1.default.getProfileById);
// ? Friendship Routes
// Create Friendship Request
router.post('/friendship/request/:id', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.createFriendshipRequest);
// This route allows a user to send a friendship request to another user.
// Get Sent Friendship Requests
router.get('/friendship/requests/sent', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.getSentFriendshipRequests);
// This route retrieves the list of sent friendship requests by the authenticated user.
// Get Friendship Requests
router.get('/friendship/requests/received', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.getReceivedFriendshipRequests);
// This route retrieves the list of received friendship requests by the authenticated user.
// The request status is pending in this case.
// Accept Friendship Request
router.patch('/friendship/accept/:id', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.acceptFriendshipRequest);
// This route allows a user to accept a pending friendship request.
// Decline Friendship Request
router.patch('/friendship/decline/:id', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.declineFriendshipRequest);
// This route allows a user to decline a pending friendship request.
// Cancel Friendship Request
router.patch('/friendship/cancel/:id', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.cancelFriendshipRequest);
// This route allows a user to cancel a sent friendship request.
// Unfriend User
router.patch('/friendship/unfriend/:id', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.unfriendUser);
// This route allows a user to unfriend another user.
// Get Friends
router.get('/friendship/friends', middleware_1.authenticateUser, friendshipController_1.friendshipCtrl.getFriends);
// This route retrieves the list of friends for the authenticated user.
router.get('/chat/:username', middleware_1.authenticateUser, chatController_1.default.getRoomChat);
exports.default = router;

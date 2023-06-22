import express from "express";
import { Request, Response, Router } from "express";
import {  authenticateUser } from "../middlewares/middleware";
import authCtrl from "../controllers/authController";
import userCtrl from "../controllers/userController";

const router = express.Router() as Router;

router.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Users is up!" });
});

//?Authentification
router.post("/register", authCtrl.signUp);
router.post("/login", authCtrl.login);
router.post("/logout", authenticateUser, authCtrl.logout);
router.get("/protected", authenticateUser, authCtrl.protected);
router.patch("/isActive", authenticateUser, authCtrl.isActiveToggle);

// ? profile
router.get("/myProfile", authenticateUser, userCtrl.getProfile);
router.get("/:id", authenticateUser, userCtrl.getProfileById);

//? Friendship Routes
// Create Friendship Request
// ! router.post("/friendship/request", authenticateUser, friendshipCtrl.createFriendshipRequest);
// This route allows a user to send a friendship request to another user.
// Requires authentication (authenticateUser middleware).

// Accept Friendship Request
//! router.patch("/friendship/accept/:requestId", authenticateUser, friendshipCtrl.acceptFriendshipRequest);
// This route allows a user to accept a pending friendship request.
// Requires authentication (authenticateUser middleware).

// Decline Friendship Request
//! router.patch("/friendship/decline/:requestId", authenticateUser, friendshipCtrl.declineFriendshipRequest);
// This route allows a user to decline a pending friendship request.
// Requires authentication (authenticateUser middleware).

// Cancel Friendship Request
// !router.patch("/friendship/cancel/:requestId", authenticateUser, friendshipCtrl.cancelFriendshipRequest);
// This route allows a user to cancel a sent friendship request.
// Requires authentication (authenticateUser middleware).

// Unfriend User
//! router.patch("/friendship/unfriend/:friendId", authenticateUser, friendshipCtrl.unfriendUser);
// This route allows a user to unfriend another user.
// Requires authentication (authenticateUser middleware).

// Get Friends
//! router.get("/friendship/friends", authenticateUser, friendshipCtrl.getFriends);
// This route retrieves the list of friends for the authenticated user.
// Requires authentication (authenticateUser middleware).

// Get Friendship Requests
//! router.get("/friendship/requests", authenticateUser, friendshipCtrl.getFriendshipRequests);
// This route retrieves the list of pending friendship requests for the authenticated user.
// Requires authentication (authenticateUser middleware).

// Get Sent Friendship Requests
//! router.get("/friendship/requests/sent", authenticateUser, friendshipCtrl.getSentFriendshipRequests);
// This route retrieves the list of sent friendship requests by the authenticated user.
// Requires authentication (authenticateUser middleware).

// // Get Received Friendship Requests
// router.get("/friendship/requests/received", authenticateUser, friendshipCtrl.getReceivedFriendshipRequests);
//! This route retrieves the list of received friendship requests by the authenticated user.
// Requires authentication (authenticateUser middleware).


export default router;

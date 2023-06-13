import express from "express";
import { Router } from "express";
import { authenticateUser } from "../middlewares/middleware";
import commentCtrl from "../controllers/commentController";

const router = express.Router() as Router;
//? Comments routes
// Create a comment for a specific post
router.post("/:postId", authenticateUser, commentCtrl.createComment);
// This route is for deleting a specific comment from a post that I created. You can delete any comment in a specific post by using the postId and commentId.
router.delete(
  "/:postId/:commentId",
  authenticateUser,
  commentCtrl.deleteOneCommentFromMyPost
);
// Delete a specific comment by id (needs authentication for the user who created the comment)
router.delete("/:commentId", authenticateUser, commentCtrl.deleteComment);

// Update a specific comment by its id
router.patch("/:commentId", authenticateUser, commentCtrl.updateComment);

// TODO:Get comments from a specific post
export default router;

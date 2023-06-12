import express from "express";
import { Request, Response, Router } from "express";
import { authenticateUser } from "../middlewares/middleware";
import commentCtrl from "../controllers/commentController";

const router = express.Router() as Router;

router.get("/", commentCtrl.getAllComments); // Get all comments

router.post("/:postId", authenticateUser, commentCtrl.createComment); // Create a comment for a specific post

router.patch("/:commentId", authenticateUser, commentCtrl.updateComment); // Update a specific comment by its id

router.delete("/:commentId", authenticateUser, commentCtrl.deleteComment); // Delete a specific comment by its id

export default router;

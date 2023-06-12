import express from "express";
import { Request, Response, Router } from "express";
import { authenticateUser } from "../middlewares/middleware";
import postCtrl from "../controllers/postController";
import commentCtrl from "../controllers/commentController";

const router = express.Router() as Router;

router.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Posts is up!" });
});

//? Posts routes
// List all posts (you might want to add pagination here in the future)
router.get("/all",authenticateUser,postCtrl.getAllPosts);

// List all posts from a specific user
router.get("/user/:userId",authenticateUser, postCtrl.getUserPosts);

// Get specific post by ID
router.get("/:postId",authenticateUser, postCtrl.getPostById);

// Create a new post (needs authentication)
router.post("/", authenticateUser, postCtrl.createPost);

// Update a post by ID (needs authentication)
router.put("/:postId", authenticateUser, postCtrl.updatePost);

// Delete a post by ID (needs authentication)
router.delete("/:postId", authenticateUser, postCtrl.deletePost);

//? Comments routes
// This route is for deleting a specific comment from a post that I created. You can delete any comment in a specific post by using the postId and commentId.
router.delete("/myPost/:postId/:commentId", authenticateUser, commentCtrl.deleteOneCommentFromMyPost);


export default router;

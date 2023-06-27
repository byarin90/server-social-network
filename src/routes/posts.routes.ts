import express from "express";
import { Request, Response, Router } from "express";
import { authenticateUser } from "../middlewares/middleware";
import postCtrl from "../controllers/postController";

const router = express.Router() as Router;

router.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Posts is up!" });
});

//? Posts routes
// List all posts (you might want to add pagination here in the future)
router.get("/friends",authenticateUser,postCtrl.getFriendsPosts);

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



export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const postController_1 = __importDefault(require("../controllers/postController"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ msg: 'Posts is up!' });
});
// ? Posts routes
// List all posts (you might want to add pagination here in the future)
router.get('/friends', middleware_1.authenticateUser, postController_1.default.getFriendsPosts);
// List all posts from a specific user
router.get('/user/:userId', middleware_1.authenticateUser, postController_1.default.getUserPosts);
// Get specific post by ID
router.get('/:postId', middleware_1.authenticateUser, postController_1.default.getPostById);
// Create a new post (needs authentication)
router.post('/', middleware_1.authenticateUser, postController_1.default.createPost);
// Update a post by ID (needs authentication)
router.put('/:postId', middleware_1.authenticateUser, postController_1.default.updatePost);
// Delete a post by ID (needs authentication)
router.delete('/:postId', middleware_1.authenticateUser, postController_1.default.deletePost);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const commentController_1 = __importDefault(require("../controllers/commentController"));
const router = express_1.default.Router();
// ? Comments routes
// Create a comment for a specific post
router.post('/:postId', middleware_1.authenticateUser, commentController_1.default.createComment);
// This route is for deleting a specific comment from a post that I created. You can delete any comment in a specific post by using the postId and commentId.
router.delete('/:postId/:commentId', middleware_1.authenticateUser, commentController_1.default.deleteOneCommentFromMyPost);
// Delete a specific comment by id (needs authentication for the user who created the comment)
router.delete('/:commentId', middleware_1.authenticateUser, commentController_1.default.deleteComment);
// Update a specific comment by its id
router.patch('/:commentId', middleware_1.authenticateUser, commentController_1.default.updateComment);
// TODO:Get comments from a specific post
exports.default = router;

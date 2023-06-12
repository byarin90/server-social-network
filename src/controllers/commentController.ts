import { Request, Response } from "express";
import Comment from "../models/commentModel";
import { IComment } from "../models/commentModel";

const commentCtrl = {
    getAllComments: async (req: Request, res: Response) => {
        // TODO: Logic for getting all comments
        
    },

    createComment: async (req: Request, res: Response) => {
        // TODO: Logic for creating a comment for a specific post
    },

    getCommentById: async (req: Request, res: Response) => {
        // TODO: Logic for getting a comment by its id
    },

    updateComment: async (req: Request, res: Response) => {
        // TODO: Logic for updating a comment
    },

    deleteComment: async (req: Request, res: Response) => {
        // TODO: Logic for deleting a comment
    }
}

export default commentCtrl;

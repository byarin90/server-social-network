import { Request, Response } from "express";
import { User } from "../models/userModel";

const userCtrl = {
getProfileById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const user = await User.findById(id).select("-password -refreshToken  -updatedAt -__v");
        if(!user || !user.isActive) return res.status(400).json({msg: "User does not exist."});
        res.json(user);
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
},
getProfile: async (req: Request, res: Response) => {
    const { _id } = req.payload;
    console.log(_id );
    try{
        const user = await User.findById(_id).select("-password -refreshToken  -updatedAt -__v");
        if(!user) return res.status(400).json({msg: "User does not exist."});
        res.json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json({msg: err.message})
    }
},
}

export default userCtrl;
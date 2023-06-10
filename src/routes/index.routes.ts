import express from "express";
import {  Request, Response,Router } from 'express'

const router = express.Router() as Router;

router.get('/', (req:Request, res:Response) => {
    res.json({ msg: "Server is up!" }); 
})



export default router;
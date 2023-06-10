import express from "express";
import { Request, Response, Router } from "express";
import { auth } from "../middlewares/middleware";
import authCtrl from "../controllers/authController";
import userCtrl from "../controllers/userController";

const router = express.Router() as Router;

router.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Users is up!" });
});


//?Authentification
router.post("/",authCtrl.signUp);
router.post("/login", authCtrl.login);
router.post('/logout', authCtrl.logout);
router.get('/protected', auth,authCtrl.protected);

export default router;

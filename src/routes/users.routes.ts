import express from "express";
import { Request, Response, Router } from "express";
import { authenticateAdmin, authenticateUser } from "../middlewares/middleware";
import authCtrl from "../controllers/authController";
import userCtrl from "../controllers/userController";

const router = express.Router() as Router;

router.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Users is up!" });
});


//?Authentification
router.post("/register",authCtrl.signUp);
router.post("/login", authCtrl.login);
router.post('/logout',authenticateUser, authCtrl.logout);
router.get('/protected', authenticateUser,authCtrl.protected);
router.patch('/isActive',authenticateUser, authCtrl.isActiveToggle);


// ? profile
router.get("/myProfile",authenticateUser,userCtrl.getProfile)
router.get("/:id", userCtrl.getProfileById);

export default router;

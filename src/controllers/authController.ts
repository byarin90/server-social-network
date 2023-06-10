import { Request, Response } from "express";
import { IUser, User } from "../models/userModel";
import { userValidation } from "../validations/userValidations";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwtUtil";
const authCtrl = {
  signUp: async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedRequestBody: IUser = userValidation.UserSchema(req.body);
      const user = new User(validatedRequestBody);
      // Hash the password
      const salt = (await bcrypt.genSalt(10)) as string;
      user.password = (await bcrypt.hash(user.password, salt)) as string;
      // Save the new user
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).send({ error: "Email already exists" });
      }
      if (error instanceof z.ZodError) {
        console.log(error);
        // Validation error
        return res.status(400).send({ error: error.errors });
      } else {
        // Other errors (like a database error)
        return res.status(500).send({ error: error });
      }
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { identifier, password } = userValidation.LoginSchema(req.body);

      let user: IUser | null;

      // Check if the identifier is a username or email
      if (identifier.includes("@")) {
        user = await User.findOne({ email: identifier });
      } else {
        user = await User.findOne({ username: identifier });
      }

      if (!user && identifier.includes("@")) {
        return res.status(404).json({ error: "Email or password inavalid" });
      }

      if (!user && !identifier.includes("@")) {
        return res.status(404).json({ error: "Username or password inavalid" });
      }

      // Check the password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect && identifier.includes("@")) {
        return res.status(401).json({ error: "Email or password inavalid" });
      }

      if (!isPasswordCorrect && !identifier.includes("@")) {
        return res.status(401).json({ error: "Username or password inavalid" });
      }

      // Create a JWT token
      const token = createJWT(user);

      // Set the JWT token in a HttpOnly cookie
      res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

      // Send response
      res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error
        return res.status(400).json({ error: error.errors });
      } else {
        // Other errors (like a database error)
        return res.status(500).json({ error: "Server error" });
      }
    }
  },
  logout: (req: Request, res: Response) => {
    // Clear the token cookie
    res.clearCookie("token");

    // Send response
    res.status(200).json({ message: "Logged out successfully" });
  },
  protected: (req: Request, res: Response) => {
    // This route is now protected
    res.json({ msg: "You're authenticated!", role: req.payload.role });
  },
};

export default authCtrl;

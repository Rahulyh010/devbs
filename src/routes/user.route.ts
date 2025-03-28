import express from "express";
import {
  loginUser,
  logoutUser,
  registrationUser,
} from "../controllers/user.controller";
import { auth } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/login", loginUser);

userRouter.post("/auth", auth);

userRouter.get("/logout", isAuthenticated, logoutUser);

export default userRouter;

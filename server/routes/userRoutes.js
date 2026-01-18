import express from "express";

import {
  getPublishedImages,
  getUser,
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getUserProfile,
  testEmail,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-verification", resendVerification);
userRouter.post("/test-email", testEmail);
userRouter.get("/data", protect, getUser);
userRouter.get("/published-images", getPublishedImages);
userRouter.get("/profile", protect, getUserProfile);

// Contact form endpoint removed

export default userRouter;

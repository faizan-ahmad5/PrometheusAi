import express from "express";
import { protect } from "../middlewares/auth.js";
import createRateLimiter from "../middlewares/rateLimiter.js";
import {
  imageMessageController,
  textMessageController,
  publishImageController,
  deleteImageController,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Rate limiter for image generation (1 request per 10 seconds per user)
const imageRateLimiter = createRateLimiter(10000, 1);

messageRouter.post("/text", protect, textMessageController);
messageRouter.post("/image", protect, imageRateLimiter, imageMessageController);
messageRouter.post("/publish", protect, publishImageController);
messageRouter.post("/delete", protect, deleteImageController);

export default messageRouter;

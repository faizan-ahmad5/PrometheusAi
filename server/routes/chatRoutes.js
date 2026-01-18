import express from "express";
import {
  createChat,
  deleteChat,
  deleteAllChats,
  getChats,
  renameChat,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
chatRouter.get("/get", protect, getChats);
chatRouter.post("/delete", protect, deleteChat);
chatRouter.post("/delete-all", protect, deleteAllChats);
chatRouter.post("/rename", protect, renameChat);

export default chatRouter;

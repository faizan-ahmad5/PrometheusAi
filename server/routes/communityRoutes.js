import express from "express";
import {
  getPublishedImagesController,
  getUserProfileController,
  getCreatorsController,
} from "../controllers/communityController.js";

const communityRouter = express.Router();

// Public endpoints - no authentication required
communityRouter.get("/images", getPublishedImagesController);
communityRouter.get("/creators", getCreatorsController);
communityRouter.get("/profile/:userName", getUserProfileController);

export default communityRouter;

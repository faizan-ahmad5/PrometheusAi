import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User who published the image
    userName: { type: String },
    imageUrl: { type: String, required: true },
    prompt: { type: String },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;

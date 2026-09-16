import mongoose from "mongoose";

const readHistory = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  readAt: {
    type: Date,
    default: Date.now(),
  },
});

export const ReadHistory = mongoose.model("ReadHistory", readHistory);

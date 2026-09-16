import mongoose from "mongoose";

const postLikesSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// the property unique: true will not allow the combination of postId and likedBy to be repeated
postLikesSchema.index({ postId: 1, likedBy: 1 }, { unique: true });

export const PostLike = mongoose.model("Postlike", postLikesSchema);

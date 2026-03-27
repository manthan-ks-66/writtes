import mongoose from "mongoose";

const commentLikesSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// the property unique: true will not allow the combination of postId and likedBy to be repeated

commentLikesSchema.index({ commentId: 1, likedBy: 1 }, { unique: true });

export const CommentLike = mongoose.model("CommentLike", commentLikesSchema);

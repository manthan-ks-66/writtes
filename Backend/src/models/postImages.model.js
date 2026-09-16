import mongoose from "mongoose";

const postImageSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    imageKitFileId: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  },
);

export const PostImage = mongoose.model("PostImage", postImageSchema);

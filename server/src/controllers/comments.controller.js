import { Comment } from "../models/comments.model.js";
import { CommentLike } from "../models/commentLikes.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

// Controller: Add Comment
const addComment = asyncHandler(async (req, res) => {
  const { postId, comment } = req.body;
  const commentedBy = req.user?._id;

  if (!isValidObjectId(postId) || !isValidObjectId(commentedBy)) {
    throw new ApiError(400, "Invalid user id or post id");
  }

  if (!comment) {
    throw new ApiError(400, "comment field is required");
  }

  const userComment = await Comment.create({
    postId,
    commentedBy,
    body: comment,
  });

  if (!userComment) {
    throw new ApiError(500, "Something went wrong!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", userComment));
});

// Controller: Like / Unlike comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  const likedBy = req.user?._id;

  if (!isValidObjectId(commentId) || !isValidObjectId(likedBy)) {
    throw new ApiError(400, "Invalid user id or comment id");
  }

  let comment = await CommentLike.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Cannot find comment");
  }

  const existingCommentLike = await CommentLike.findOne({ commentId, likedBy });

  if (existingCommentLike) {
    await CommentLike.findByIdAndDelete(existingCommentLike._id);
    await Comment.updateOne({ _id: commentId }, { $inc: { likesCount: -1 } });

    comment = await Comment.findById(comment._id);
  } else {
    await CommentLike.create({
      commentId,
      likedBy,
    });
    await Comment.updateOne({ _id: commentId }, { $inc: { likesCount: 1 } });

    comment = await Comment.findById(comment._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "comment like toggled successfully", comment));
});

// Controller: Get Post comments
const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.query;
})

export { addComment, toggleCommentLike };

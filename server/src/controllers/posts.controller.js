// model imports
import { Post } from "../models/posts.model.js";
import { PostLike } from "../models/postLikes.model.js";
import { PostImage } from "../models/postImages.model.js";

// utilities and methods and modules
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToImageKit } from "../utils/imagekit.js";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";

// Post Controllers
const publishPost = asyncHandler(async (req, res) => {
  const { title, slug, content, category } = req.body;

  const userId = req.user?._id;

  let imagekitFeaturedImage = null;

  const featuredImagePath = req.file?.path;
  const imageFileName = req.file?.originalname;

  if ([title, slug, content, category].some((field) => !field)) {
    throw new ApiError(400, "All fields are required!");
  }

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "User Unauthenticated");
  }

  if (featuredImagePath) {
    imagekitFeaturedImage = await uploadToImageKit(
      featuredImagePath,
      imageFileName,
      "featuredImages",
    );

    if (!featuredImagePath) {
      throw new ApiError(500, "Image upload failed!");
    }
  }

  const publishedPost = await Post.create({
    title,
    slug,
    content,
    category,
    userId,
    featuredImage: imagekitFeaturedImage?.url,
  });

  if (!publishedPost) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Post published successfully", publishedPost));
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, slug, category } = req.body;

  const { postId } = req.params;
  const userId = req.user?._id;

  let cloudinaryFeautredImage = null;

  const featuredImagePath = req.file?.path;

  if ([title, slug, content, category].some((field) => !field)) {
    throw new ApiError(400, "Required fields are empty");
  }

  if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
    throw new ApiError(400, "Unauthorized: Invalid user id or post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "No post found!");
  }

  if (!post.userId.equals(userId)) {
    throw new ApiError(400, "Unauthorized: You do not own this post");
  }

  if (featuredImagePath) {
    cloudinaryFeautredImage = await uploadToCloudinary(featuredImagePath);

    if (!cloudinaryFeautredImage) {
      throw new ApiError(500, "Image upload failed!");
    }

    post.featuredImage = cloudinaryFeautredImage?.url;
  }

  post.title = title;
  post.slug = slug;
  post.content = content;
  post.category = category;
  post.editedAt = new Date();

  const updatedPost = await post.save({ validateBeforeSave: true });

  if (!updatedPost) {
    throw new ApiError(500, "Failed to update post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", updatedPost));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  const totalPosts = await Post.countDocuments();

  const posts = await Post.find({})
    .sort()
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const data = {
    posts,
    totalPosts: totalPosts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully", data));
});

const getQueryPosts = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 5 } = req.query;

  if (!query) {
    throw new ApiError(400, "Query is required");
  }

  const filter = {
    title: { $regex: query, $options: "i" },
  };

  const posts = await Post.find(filter)
    .sort()
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalPosts = await Post.find(filter).countDocuments();

  if (posts.length === 0) {
    return res.status(200).json(new ApiResponse(200, "No posts found", {}));
  }

  const data = {
    posts,
    totalPosts: totalPosts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Query posts fetched successfully", data));
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  const likedBy = req.user?._id;

  if (!isValidObjectId(likedBy) || !isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid user id or post id");
  }

  // check - if post is valid
  let post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "No post found");
  }

  try {
    await PostLike.create({ postId, likedBy });

    post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: 1 } },
      { new: true },
    );

    return res.status(200).json(
      new ApiResponse(200, "Post Liked successfully", {
        likesCount: post.likesCount,
        isLiked: true,
      }),
    );
  } catch (error) {
    if (error.code === 11000) {
      await PostLike.deleteOne({ postId, likedBy });

      post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true },
      );

      return res.status(200).json(
        new ApiResponse(200, "Post un-liked successfully", {
          likesCount: post.likesCount,
          isLiked: false,
        }),
      );
    } else {
      throw error;
    }
  }
});

const fetchPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const token = req.cookies?.accessToken;
  let decodedToken;

  if (token) {
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // continue to fetch the post for logged out user
      }
    }
  }

  // access userId ( likedBy ) if user is logged in to find out whether user has liked the post
  const userId = decodedToken
    ? new mongoose.Types.ObjectId(decodedToken._id)
    : null;

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },

    // Join with postlikes to check if the current user has liked this post
    {
      $lookup: {
        from: "postlikes",

        // at this stage we are still in the posts context (packing our box -> let post_id)
        let: { post_id: "$_id" },

        // sub pipeline to implement the $ match stage to filter out (now we will be in postlikes collection)
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$post_id"] },
                  { $eq: ["$likedBy", userId] },
                ],
              },
            },
          },
        ],
        as: "userLikedStatus",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        slug: 1,
        featuredImage: 1,
        category: 1,
        likesCount: 1,
        commentsCount: 1,
        createdAt: {
          $dateToString: {
            date: "$createdAt",
            format: "%d %b %Y",
            timezone: "Asia/Kolkata",
          },
        },
        updatedAt: {
          $dateToString: {
            date: "$createdAt",
            format: "%d %b %Y",
            timezone: "Asia/Kolkata",
          },
        },
        author: {
          username: 1,
          fullName: 1,
          avatar: 1,
        },
        isLiked: {
          $cond: {
            // if $ size returns array as 1 flag gets true and if 0 flag gets false
            if: { $gt: [{ $size: "$userLikedStatus" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  if (post?.length === 0) {
    throw new ApiError(400, "No post found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post fetched successfully", post[0]));
});

const uploadEditorImage = asyncHandler(async (req, res) => {
  const editorImageLocalPath = req.file?.path;

  const userId = req.user?._id;
  const { postId } = req.body;

  if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
    throw new ApiError(400, "User id or Post id is invalid");
  }

  if (!editorImageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const imageKitFile = await uploadToImageKit(
    editorImageLocalPath,
    req.file?.originalname,
    "posts",
  );

  if (!imageKitFile) {
    throw new ApiError(500, "Image upload failed");
  }

  await PostImage.create({
    imageKitFileId: imageKitFile.fileId,
    fileName: imageKitFile.name,
    url: imageKitFile.url,
    uploadedBy: userId,
    postId: postId,
  });

  const image = {
    url: imageKitFile.url,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Imagekit file upload completed", image));
});

export {
  fetchPost,
  publishPost,
  getAllPosts,
  updatePost,
  togglePostLike,
  getQueryPosts,
  uploadEditorImage,
};

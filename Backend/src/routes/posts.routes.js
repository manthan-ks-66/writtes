import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  fetchPost,
  updatePost,
  publishPost,
  togglePostLike,
  getAllPosts,
  getQueryPosts,
  uploadEditorImage,
} from "../controllers/posts.controller.js";

const router = Router();

router.route("/get-all-posts").get(getAllPosts);

router.route("/get-query-post").get(getQueryPosts);

router.route("/fetch-post/:postId").get(fetchPost);

// secured routes:
router
  .route("/upload-to-imagekit")
  .post(verifyJWT, upload.single("editor-image"), uploadEditorImage);

router
  .route("/publish-post")
  .post(verifyJWT, upload.single("featuredImage"), publishPost);

router.route("/toggle-like").post(verifyJWT, togglePostLike);

router
  .route("/update-post/:postId")
  .patch(verifyJWT, upload.single("featuredImage"), updatePost);

export default router;

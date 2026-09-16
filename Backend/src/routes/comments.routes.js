import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { addComment } from "../controllers/comments.controller.js";

const router = Router();

router.route("/add-comment").post(verifyJWT, addComment);

export default router;
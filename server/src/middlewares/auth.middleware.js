import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  let decodedToken;

  if (!token) {
    throw new ApiError(400, "User token is missing");
  }

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Session Expired");
    }

    throw new ApiError(400, "Invalid Token");
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized - User not found");
  }

  req.user = user;
  next();
});

export { verifyJWT };

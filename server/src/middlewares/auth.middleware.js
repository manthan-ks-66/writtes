import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";

const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access Token is missing / Session Expired");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Unauthorized - Cannot find user");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token Expired");
    }

    throw new ApiError(500, "Something went wrong");
  }
};

export { verifyJWT };

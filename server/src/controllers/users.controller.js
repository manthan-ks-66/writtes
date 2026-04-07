// model imports
import { User } from "../models/users.model.js";
import { PostLike } from "../models/postLikes.model.js";

// utilities and method imports
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToImageKit, deleteImageKitFile } from "../utils/imagekit.js";
import asyncHandler from "../utils/asyncHandler.js";
import returnHTML from "../utils/returnMailHtml.js";

// module imports
import jwt from "jsonwebtoken";
import { randomInt, createHash } from "node:crypto";
import mongoose, { isValidObjectId } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { Resend } from "resend";

// Methods and configs:
// Resend config
const resend = new Resend(process.env.RESEND_VERIFICATION_MAIL_API_KEY);

// http cookie options
const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

// user OTP generator method
const generateAndSendOTP = async (processMsg, user, email, subject) => {
  const otp = randomInt(100000, 999999);

  await user.hashOTP(otp);
  await user.save();

  const firstName = user.fullName.trim().split(" ")[0];
  const mailHTML = returnHTML(processMsg, firstName, email, subject, otp);

  await resend.emails.send({
    from: "PROSE <noreply@verify.onprose.tech>",
    to: email,
    subject: subject,
    html: mailHTML,
  });
};

// generate user accessToken and refreshToken for login
const generateUserTokens = async ({ user }) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = user.toJSON();

    return { loggedInUser, accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

// generate unique username for google authenticated users
const generateUniqueUsername = (given_name, sub) => {
  const base = given_name.trim().toLowerCase();
  const suffix = createHash("sha256").update(sub).digest("hex").slice(0, 5);
  const username = `${base}_${suffix}`;

  return username;
};

// User Controllers:
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "Required fields are empty");
  }

  const existedUsername = await User.findOne({ username: username });

  if (existedUsername) {
    throw new ApiError(400, "Username is already taken");
  }

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    if (existedUser.isVerified) {
      throw new ApiError(400, "User is already registered");
    }

    Object.assign(existedUser, {
      fullName,
      email,
      password,
      username,
      lifeTime: Date.now(),
    });

    await generateAndSendOTP(
      "registration process",
      existedUser,
      email,
      "User Registration OTP",
    );

    const verificationToken = existedUser.generateVerificationToken();

    return res
      .status(201)
      .cookie("verificationToken", verificationToken, options)
      .json(
        new ApiResponse(200, "OTP for registration has been sent successfully"),
      );
  }

  const user = await User.create({
    avatar: null,
    authProvider: "local",
    username,
    email,
    password,
    fullName,
    lifeTime: Date.now(),
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  await generateAndSendOTP(
    "registration process",
    user,
    email,
    "One Time Password for user registration",
  );

  const verificationToken = user.generateVerificationToken();

  return res
    .status(201)
    .cookie("verificationToken", verificationToken, options)
    .json(
      new ApiResponse(
        201,
        "User registered and OTP has been sent successfully",
      ),
    );
});

const regenerateRegistrationOTP = asyncHandler(async (req, res) => {
  const verificationToken = req.cookies?.verificationToken;
  let decodedToken;

  if (!verificationToken) {
    throw new ApiError(400, "Invalid token: User is not registered");
  }

  try {
    decodedToken = jwt.verify(
      verificationToken,
      process.env.VERIFICATION_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(400, "Session Expired - Register again");
  }

  const user = await User.findOne({ _id: decodedToken._id });

  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is verified");
  }

  await generateAndSendOTP(
    "registration process",
    user,
    user.email,
    "One Time Password for user registration",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "OTP re-sent to the registered email successfully"),
    );
});

const verifyAndLoginUser = asyncHandler(async (req, res) => {
  /**
   * get verificationToken, otp from req
   * decode the token and check the token expiry
   * find the user from the decoded token
   * check if otp is expired
   * check if otp is correct
   * update the user as verified
   * generate user tokens for login
   * return res - login
   */

  const { otp } = req.body;

  const verificationToken = req.cookies?.verificationToken;
  let decodedToken;

  if (!verificationToken) {
    throw new ApiError(400, "Invalid token: User is not registered");
  }

  try {
    decodedToken = jwt.verify(
      verificationToken,
      process.env.VERIFICATION_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(400, "Session Expired - Register again");
  }

  const userAccount = await User.findOne({ _id: decodedToken._id });

  if (!userAccount) {
    throw new ApiError(400, "User not found");
  }

  const userId = userAccount._id;

  if (Date.now() > userAccount.otpExpiry) {
    throw new ApiError(400, "OTP is expired! Register Again");
  }

  const isOTPCorrect = await userAccount.isOtpCorrect(otp);

  if (!isOTPCorrect) {
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        isVerified: true,
      },
      $unset: {
        lifeTime: true,
        OTP: true,
        otpExpiry: true,
      },
    },
    { new: true },
  );

  const { accessToken, refreshToken } = await generateUserTokens({
    user,
  });

  return res
    .status(200)
    .clearCookie("verificationToken")
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "User verified and user tokens returned successfully",
        user.toJSON(),
      ),
    );
});

const authenticateWithGoogle = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const client = new OAuth2Client(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECRET,
    "postmessage",
  );

  const { tokens } = await client.getToken(code);
  const idToken = tokens.id_token;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_AUTH_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, given_name, sub, name, picture } = payload;

  // Priorities for user registerd locally and by google
  // Priority 1 - find the user by googleId
  let user = await User.findOne({ googleId: sub });

  if (user) {
    // in case if user has updated the email at google
    if (user.email !== email || user.fullName !== name) {
      user.fullName = name;
      user.email = email;
      await user.save();
    }
  } else {
    /**
     * Priority 2 - find the user by email (in case user is registered locally)
  
     * this else case will only run when user from the googleId is not found - then find the user by email
     * if the user from the email is still not found then create user to proceed further for login

     * - if user by googleId is found the logic proceeds to generate user tokens (login)
     */
    user = await User.findOne({ email });

    if (user) {
      user.googleId = sub;
      await user.save();
    } else {
      const username = generateUniqueUsername(given_name, sub);

      user = await User.create({
        fullName: name,
        googleId: sub,
        email: email,
        username: username,
        isVerified: true,
        avatar: {
          url: picture,
        },
      });
    }
  }

  const { loggedInUser, accessToken, refreshToken } = await generateUserTokens({
    user,
  });

  const statusCode = user.isNew ? 201 : 200;

  return res
    .status(statusCode)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        statusCode,
        "User tokens returned successfully",
        loggedInUser,
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  // in case if user registered with google
  if (user.authProvider === "google" && !user.password) {
    throw new ApiError(400, "Invalid user credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid user credentials");
  }

  const { loggedInUser, accessToken, refreshToken } = await generateUserTokens({
    user,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User tokens returned successfully", {
        user: loggedInUser,
      }),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshToken: 1,
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User tokens removed successfully", {}));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  const userId = req.user?._id;
  const fileName = req.file?.originalname;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const oldFileId = user.avatar?.fileId;

  const imagekitAvatar = await uploadToImageKit(
    avatarLocalPath,
    fileName,
    "users",
  );

  if (!imagekitAvatar) {
    throw new ApiError(500, "File upload failed");
  }

  try {
    user.avatar = {
      url: imagekitAvatar.url,
      fileId: imagekitAvatar.fileId,
    };

    await user.save();
  } catch (error) {
    if (imagekitAvatar?.fileId) {
      try {
        await deleteImageKitFile(imagekitAvatar.fileId);
      } catch (cleanupErr) {
        console.log(
          "Imagekit rollback delete failed\n",
          cleanupErr.message,
          "\nfileId: ",
          imagekitAvatar?.fileId,
        );
      }
    }

    throw new ApiError(500, "User avatar update failed");
  }

  if (oldFileId) {
    try {
      await deleteImageKitFile(oldFileId);
    } catch (error) {
      console.log(
        "imagekit avatar file deletion failed\n",
        error.message,
        "\nfile_id: ",
        oldFileId,
      );
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", user.toJSON()));
});

const removeUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user?.avatar?.fileId) {
    throw new ApiError(400, "No avatar image found");
  }

  const { fileId } = user.avatar;

  // delete from imagekit
  try {
    await deleteImageKitFile(fileId);
  } catch (error) {
    console.log("Imagekit file deletion failed", fileId);
  }

  user.avatar = null;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User avatar removed successfully", user.toJSON()),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", user));
});

const handleResetPasswordOTP = asyncHandler(async (req, res) => {
  /* 
  get email from req.body

  find the user in the db
    - throw error if user is not found

  generate cryptoOtp and otpExpiry

  hash the otp using bcrypt (user.hashOTP)

  save the cryptoOtp (hashed) and otpExpiry in the db

  send the cryptoOtp to user in mail
  
  return res as otp sent */

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User with this email is not registered");
  }

  const otp = randomInt(100000, 999999);

  await user.hashOTP(otp);
  await user.save();

  await generateAndSendOTP(
    "password reset process",
    user,
    email,
    "Password reset One Time PassCode",
  );

  const verificationToken = user.generateVerificationToken();

  return res
    .status(200)
    .cookie("verificationToken", verificationToken, options)
    .json(new ApiResponse(200, "OTP sent to registered email successfully"));
});

const resetUserPassword = asyncHandler(async (req, res) => {
  /**
    * get verificationToken, otp, newPassword, confirmNewPassword from req
    * check newPassword is equal to confirmNewPassword
    * find the user from the db by decoding the token
        - throw error if user is not registered
    * check if the otp is expired 
        - throw error if Date.now is > otpExpiry
    * check if otp is correct 
    * update the user password in the db and set the passwordResetOTP and otpExpiry field as null 
    * return res - password updated
    */

  const { otp, newPassword, confirmNewPassword } = req.body;
  const verificationToken = req.cookies?.verificationToken;

  let decodedToken;

  if (
    [otp, newPassword, confirmNewPassword].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "Required field is empty");
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Password doesn't match with confirmed password");
  }

  if (!verificationToken) {
    throw new ApiError(
      400,
      "Invalid request - User has not requested for password update",
    );
  }

  try {
    decodedToken = jwt.verify(
      verificationToken,
      process.env.VERIFICATION_TOKEN_SECRET,
    );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(400, "Session Expired");
    }

    throw new ApiError(400, "Invalid token");
  }

  const user = await User.findOne({ _id: decodedToken._id });

  if (!user) {
    throw new ApiError(400, "User is not registered");
  }

  if (Date.now() > user.otpExpiry) {
    throw new ApiError(400, "OTP Expired");
  }

  const isOTPValid = user.isOtpCorrect(otp);

  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        password: newPassword,
      },
      $unset: {
        OTP: true,
        otpExpiry: true,
      },
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(500, "Password update failed");
  }

  return res
    .status(200)
    .clearCookie("verificationToken")
    .json(new ApiResponse(200, "Password updated successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const { bio, fullName, about, x, linkedIn, instagram, github } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Name cannot be empty");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        bio,
        fullName,
        about,
        x,
        linkedIn,
        instagram,
        github,
      },
    },
    {
      new: true,
    },
  );

  if (!user) {
    throw new ApiError(400, "Cannot find user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User details updated successfully", user.toJSON()),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  let decodedToken;

  if (!incomingToken) {
    throw new ApiError(400, "Token is missing");
  }

  try {
    decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(400, "Session Expired - Please login");
    }

    throw new ApiError(400, "Invalid Token");
  }

  const user = await User.findOne({ _id: decodedToken._id }).select(
    "+refreshToken",
  );

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.refreshToken !== incomingToken) {
    throw new ApiError(400, "Invalid Token");
  }

  const { loggedInUser, accessToken, refreshToken } = await generateUserTokens({
    user,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User tokens returned successfully", loggedInUser),
    );
});

const getUserLikedPosts = asyncHandler(async (req, res) => {
  const likedBy = req.user?._id;

  if (!isValidObjectId(likedBy)) {
    throw new ApiError(400, "Invalid user id");
  }

  // left join of PostLikes (left) with Posts (right) and Posts (array) with Users (right)
  const userLikedPosts = await PostLike.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(likedBy),
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "postId",
        foreignField: "_id",
        as: "userLikedPost",
        pipeline: [
          {
            $project: {
              title: 1,
              content: 1,
              userId: 1,
              slug: 1,
              featuredImage: 1,
              createdAt: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d %b %Y",
                  timezone: "Asia/Kolkata",
                },
              },
              updatedAt: {
                $dateToString: {
                  date: "$updatedAt",
                  format: "%d %b %Y",
                  timezone: "Asia/Kolkata",
                },
              },
              category: 1,
              likesCount: 1,
              commentsCount: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$userLikedPost",
    },
    {
      $project: {
        _id: 0,
        userLikedPost: 1,
      },
    },
  ]);

  if (userLikedPosts.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "You have not liked any post", []));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User liked posts fetched successfully",
        userLikedPosts,
      ),
    );
});

const fetchAuthor = asyncHandler(async (req, res) => {
  const { username } = req.params;
  let dbUsername;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  if (username[0] === "@") {
    dbUsername = username.replace("@", "");
  } else {
    dbUsername = username;
  }

  const author = await User.findOne(
    { username: dbUsername },
    {
      _id: 0,
      fullName: 1,
      avatar: 1,
      bio: 1,
      about: 1,
      username: 1,
      x: 1,
      instagram: 1,
      github: 1,
      linkedIn: 1,
    },
  );

  if (!author) {
    throw new ApiError(400, "Author not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Author details fetched successfully", author));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  // TODO: delete user
});

export {
  fetchAuthor,
  registerUser,
  regenerateRegistrationOTP,
  authenticateWithGoogle,
  removeUserAvatar,
  verifyAndLoginUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getCurrentUser,
  resetUserPassword,
  handleResetPasswordOTP,
  updateUserDetails,
  refreshAccessToken,
  deleteUserAccount,
  getUserLikedPosts,
};

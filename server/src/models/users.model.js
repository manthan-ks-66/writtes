import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // user data fields
    avatar: {
      url: {
        type: String,
      },
      fileId: {
        type: String,
      },
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      required: true,
      enum: ["local", "google"],
    },

    // user information fields
    bio: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },

    // user social link fields
    instagram: {
      type: String,
      default: "",
    },
    likedIn: {
      type: String,
      default: "",
    },
    x: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },

    // temporary fields for verification
    OTP: {
      type: String,
      default: undefined,
    },
    otpExpiry: {
      type: Date,
      default: undefined,
    },
    lifeTime: {
      type: Date,
      index: { expires: "24hr" },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.refreshToken;

    return ret;
  },
});

// Middlewares
// bcrypt password hashing
userSchema.pre("save", async function () {
  // check: if password is changed while updating user data on userSchema
  if (!this.password || !this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("findOneAndUpdate", async function () {
  // getUpdate() returns update specifications not the document or updated document
  const update = this.getUpdate();

  if (!update) return;

  const plainPassword =
    update.password || (update.$set && update.$set.password);

  if (!plainPassword || typeof plainPassword !== "string") return;

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  if (update.password) {
    update.password = hashedPassword;
  } else if (update.$set && update.$set.password) {
    update.$set.password = hashedPassword;
  }
});

// mongoose pre-defined methods on userSchema
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateVerificationToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      username: this.username,
    },
    process.env.VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY,
    },
  );
};

// password validation:
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashOTP = async function (otp) {
  this.OTP = await bcrypt.hash(otp.toString(), 10);
  this.otpExpiry = Date.now() + 2 * 60 * 1000;

  return await this.save();
};

userSchema.methods.isOtpCorrect = async function (userOTP) {
  return bcrypt.compare(userOTP, this.OTP);
};

export const User = mongoose.model("User", userSchema);

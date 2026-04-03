import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  }),
);

// middlewares
app.use(express.json());
// encode the url that has symbols and special charecters like %_ @#
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// home route
app.get("/", (_, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "OK",
    status: "success",
  });
});

// route imports
import usersRouter from "./routes/users.routes.js";
import postsRouter from "./routes/posts.routes.js";
import commentsRouter from "./routes/comments.routes.js";

// route declarations
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Something went wrong";

//   return res.status(statusCode).json({
//     success: false,
//     message: message,
//     errors: err.errors || [],
//   });
// });

export default app;

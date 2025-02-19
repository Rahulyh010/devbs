require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import blogRouter from "./routes/blog.route";
import awsRouter from "./routes/aws.route";
import reviewRoutes from "./routes/review.routes";
import { linkedInAuthCallback } from "./controllers/linkedin.controller";

export const app = express();

app.use(express.json());

// cookie parser
app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.any());

const allowedOrigins = [
  "https://admin.bskilling.com",
  "http://13.233.103.203:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://www.bskilling.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.get("/api/auth/callback/linkedin", linkedInAuthCallback);
// route
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  blogRouter,
  awsRouter,
  reviewRoutes
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Server Running successful",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);

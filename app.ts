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
import { errorHandler } from "./utils/helpers1/globalErrorHandler";
import requestLogger from "./utils/requestLogger";
import logger from "./utils/logger";
import AllRoutes from "./routes/index";
import helmet from "helmet";
import env from "./utils/env";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://*"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Apply multer middleware for file uploads
app.use(upload.single("file"));
// Request parsing
app.use(express.json({ limit: "10kb" }));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middlewares
// app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(cookieParser());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// app.use(express.json());

// // cookie parser
app.use(cookieParser());

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// app.use(upload.any());

const allowedOrigins = [
  "https://admin.bskilling.com",
  "http://13.233.103.203:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://www.bskilling.com",
  "https://www.dev.bskilling.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const gracefulShutdown = () => {
  logger.warn("⚠️ Shutting down gracefully...");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.use(requestLogger);
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
app.use("/api", AllRoutes);
app.use(errorHandler);

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

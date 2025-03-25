require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
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

// Security middleware - Helmet
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

// Configure multer but don't apply it globally
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Note: Multer should be applied to specific routes only, not globally

// Request parsing
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Security and optimization middlewares
app.use(hpp());
app.use(cookieParser());
app.use(compression());

// Rate limiting - increased to handle more traffic
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  "https://admin.bskilling.com",
  "http://13.233.103.203:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://www.bskilling.com",
  "https://www.dev.bskilling.com",
  "https://devadmin.bskilling.com",
  "https://s14vl5ld-3000.inc1.devtunnels.ms",
  "https://dev.bskilling.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Graceful shutdown handling
const gracefulShutdown = () => {
  logger.warn("⚠️ Shutting down gracefully...");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Request logging
app.use(requestLogger);

// Routes

app.use("/api", AllRoutes);

app.get("/api/auth/callback/linkedin", linkedInAuthCallback);
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  blogRouter,
  awsRouter,
  reviewRoutes
);

// Global error handler
app.use(errorHandler);

// Health check route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Server Running successful",
  });
});

// Unknown route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

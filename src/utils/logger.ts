import winston from "winston";
import chalk from "chalk";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    const levelColor =
      {
        info: chalk.blue,
        warn: chalk.yellow,
        error: chalk.red.bold,
        debug: chalk.green,
      }[level] || chalk.white;

    return `${chalk.gray(`[${timestamp}]`)} ${levelColor(
      level.toUpperCase()
    )}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [new winston.transports.Console()],
});

// Unhandled Promise Rejections
process.on("unhandledRejection", (reason: any, promise) => {
  logger.error(`🚨 Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Uncaught Exceptions
process.on("uncaughtException", (err) => {
  logger.error(`🔥 Uncaught Exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

export default logger;

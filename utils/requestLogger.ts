import morgan from "morgan";
import logger from "../utils/logger";

const requestLogger = morgan((tokens, req, res) => {
  const log = [
    `📢 ${tokens.method(req, res)}`,
    `🌍 ${tokens.url(req, res)}`,
    `🕒 ${tokens["response-time"](req, res)} ms`,
    `📡 ${tokens.status(req, res)}`,
  ].join(" | ");

  logger.info(log);
  return log;
});

export default requestLogger;

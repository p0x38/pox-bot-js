// src/logger.ts
import { createLogger, format, transports } from "winston";
var { combine, timestamp, printf, colorize, padLevels, errors, ms } = format;
var richConsoleFormat = printf(({ level, message, timestamp: timestamp2, ms: ms2, stack, ...metadata }) => {
  const ts = `\x1B[2m${timestamp2}\x1B[0m`;
  const timeTaken = ms2 ? ` \x1B[33m${ms2}\x1B[0m` : "";
  const content = stack || message;
  const meta = Object.keys(metadata).length ? `
\x1B[2m${JSON.stringify(metadata, null, 2)}\x1B[0m` : "";
  return `${ts} ${level} ${content}${timeTaken}${meta}`;
});
var logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        ms(),
        colorize(),
        padLevels(),
        errors({ stack: true }),
        richConsoleFormat
      )
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.json())
    }),
    new transports.File({
      filename: "logs/combined.log",
      level: "debug",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
      )
    })
  ]
});
var logger_default = logger;

export {
  logger_default
};

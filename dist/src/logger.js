"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, padLevels, errors, ms } = winston_1.format;
const richConsoleFormat = printf(({ level, message, timestamp, ms, stack, ...metadata }) => {
    const ts = `\x1b[2m${timestamp}\x1b[0m`;
    const timeTaken = ms ? ` \x1b[33m${ms}\x1b[0m` : '';
    const content = stack || message;
    const meta = Object.keys(metadata).length ? `\n\x1b[2m${JSON.stringify(metadata, null, 2)}\x1b[0m` : '';
    return `${ts} ${level} ${content}${timeTaken}${meta}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    transports: [
        new winston_1.transports.Console({
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), ms(), colorize(), padLevels(), errors({ stack: true }), richConsoleFormat)
        }),
        new winston_1.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.json())
        }),
        new winston_1.transports.File({
            filename: 'logs/combined.log',
            level: 'debug',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(info => `${info.timestamp} [${info.level}]: ${info.message}`))
        })
    ]
});
exports.default = logger;

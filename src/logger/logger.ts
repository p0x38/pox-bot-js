import { join } from 'node:path';

import { createLogger, format, transports, type Logger } from 'winston';

import { getPlatformPaths } from '@/platform';

const { combine, timestamp, printf, colorize, padLevels, errors, ms } = format;

const paths = getPlatformPaths('pox-bot');

const richConsoleFormat = printf(
    ({ level, message, timestamp, ms, stack, ...metadata }) => {
        const ts = `\x1b[2m${timestamp}\x1b[0m`;
        const timeTaken = ms ? ` \x1b[33m${ms}\x1b[0m` : '';

        const content = stack || message;
        const meta = Object.keys(metadata).length
            ? `\n\x1b[2m${JSON.stringify(metadata, null, 2)}\x1b[0m`
            : '';

        return `${ts} ${level} ${content}${timeTaken}${meta}`;
    },
);

const logger: Logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                ms(),
                colorize(),
                padLevels(),
                errors({ stack: true }),
                richConsoleFormat,
            ),
        }),

        new transports.File({
            filename: join(paths.logs, 'error.log'),
            level: 'error',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.json(),
            ),
        }),

        new transports.File({
            filename: join(paths.logs, 'combined.log'),
            level: 'debug',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf(
                    (info) =>
                        `${info.timestamp} [${info.level}]: ${info.message}`,
                ),
            ),
        }),
    ],
});

export default logger;

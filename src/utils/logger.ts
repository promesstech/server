import winston from "winston";
const {
    combine,
    printf,
    errors,
    colorize,
    json,
} = winston.format;
// import { Temporal } from "@js-temporal/polyfill";

const logFormat = printf(({
    level,
    message,
    timestamp,
    stack,
}) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const prodFormat = combine(
    winston.format.timestamp(),
    json(),
    errors({ stack: true }),
);
const devFormat = combine(
    colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat,
);

const format = process.env.NODE_ENV === "production" ? prodFormat: devFormat;

const logger = winston.createLogger({
    level: "http",
    format,
    transports: [
        new winston.transports.Console(),
    ],
});

export { logger };
import { Response } from "express";
import { logger } from "./logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (err: any, res?: Response) => {
    logger.error(err);
    // use sentry to send error notification
    
    if (!err.isOperational)
        process.exit(1);

    if (res) res.status(err.statusCode).send({
        message: err.message,
        code: err.statusCode,
    });
};


export class AppError extends Error {
    statusCode: number;

    isOperational: boolean;
    
    constructor(statusCode: number, message: string, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        
        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);
    };
};

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    };
};
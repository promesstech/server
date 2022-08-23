
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import express from "express";
import { User } from "@prisma/client";

import {
    connectToDatabase,
    disconnectFromDatabase,
} from "./utils/database";
import { handleError } from "./utils/errors";
import { logger } from "./utils/logger";
import {
    setupAxios,
    setupRouter,
    setupServer,
    setupApp,
    setupWebsocketServer,
    setupGoogleOAuth2,
    setupMulter,
} from "./utils/setup";


declare module "express" {
    interface Request {
        baseServerUrl?: string;
        user?: User;
    }
};

const database = connectToDatabase();
const router = setupRouter();
const app = setupApp(router);
const server = setupServer(app);
const axios = setupAxios();
const io = setupWebsocketServer(server);
const google = setupGoogleOAuth2();
const multer = setupMulter();

// certain routes use the io instance
// so it has to exist before they are imported
// so the import statement is after the wss is setup
import createRoutes from "./routes";
createRoutes(router);

app.use((err, req: express.Request, res: express.Response) => {
    handleError(err, res);
});

process.on("unhandledRejection", err => handleError(err));
process.on("uncaughtException", err => handleError(err));


const signals = [
    "SIGTERM",
    "SIGINT",
];

const gracefulShutdown = (signal: string) => {
    process.on(signal, () => {
        logger.info(`Received ${signal}. Exiting...`);
        
        disconnectFromDatabase();
        logger.info("Database connection closed");
        
        server.close(() => {
            logger.info("Server closed");
            process.exit();
        });
    });
};

signals.forEach(signal => {
    gracefulShutdown(signal);
});

export {
    router,
    database,
    axios,
    io,
    google,
    multer,
};
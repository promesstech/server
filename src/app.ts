// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import express, {
    Application,
    Request,
    Response,
    NextFunction,
} from "express";

import compression from "compression";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import Axios from "axios";

import {
    createDatabase,
    disconnectFromDatabase,
} from "./utils/database";
import { handleError } from "./utils/errors";
import { logger } from "./utils/logger";
import { getServerURL } from "./utils/core";

import config from "./config";
import createRoutes from "./routes";

declare module "express" {
    interface Request {
        baseServerUrl?: string;
    }
};

const database = createDatabase(config.database.connectionString);
const router = express.Router();

const app: Application = express()
    .use(helmet())
    .use(compression())
    .use(cors({
        origin: config.core.websiteUrl,
        credentials: true,
    }))
    .use(bodyParser.json())
    .use((req: Request, res: Response, next: NextFunction) => {
        const baseUrl = getServerURL(req);
        // eslint-disable-next-line no-param-reassign
        req.baseServerUrl = baseUrl;
        next();
    })
    // .use((req: Request, res: Response, next: NextFunction) => {
    //     console.log(req.cookies);
    //     next();
    // })
    .use("/v1", router);

// TODO: Serialize session

const axios = Axios.create({
    timeout: 2500,
    validateStatus: () => true,
});

router.get("/", (req: Request, res: Response) => {
    res.json({ success: true });
});

app.use("*", (req: Request, res: Response) => {
    // structured "404 not found" error response
    res.status(404).send({
        message: "Not Found",
        code: 404,
    });
});

createRoutes(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

process.on("unhandledRejection", err => handleError(err));
process.on("uncaughtException", err => handleError(err));

const PORT = config.core.PORT;

const server = app.listen(PORT, () => {
    logger.info(`Server is running at http://localhost:${PORT}`);
});

const signals = [
    "SIGTERM",
    "SIGINT",
];

const gracefulShutdown = (signal: string) => {
    process.on(signal, () => {
        logger.info(`Received ${signal}. Exiting...`);
        
        // disconnectFromDatabase().then(() => {
        //     logger.info("Database connection closed");
        // });
        disconnectFromDatabase();
        
        server.close(() => {
            logger.info("Server closed");
            process.exit();
        });
    });
};

signals.forEach(signal => {
    gracefulShutdown(signal);
});

// {"event":"messageCreate","data":{"content":"some message content","channel":{"id":"chn_12345678"}}}

export {
    router,
    database,
    axios,
};
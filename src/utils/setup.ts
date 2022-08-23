import express from "express";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import socketio from "socket.io";
import cookieParser from "cookie-parser";
import { google } from "googleapis";
import multer from "multer";
import Axios from "axios";

import { getServerURL } from "./core";
import { logger } from "./logger";
import { deserializeSession } from "./auth";

import config from "../config";
import {
    ClientToServerEvents,
    ServerToClientEvents,
} from "../types";

export const setupRouter = (): express.Router => {
    const router = express.Router();
    
    router.get("/", (req: express.Request, res: express.Response) => {
        res.json({ success: true });
    });

    return router;
};

export const setupServer = (app: express.Application): http.Server => {
    const server = http.createServer(app);

    const PORT = config.core.PORT;

    server.listen(PORT, () => {
        logger.info(`Server is running at http://localhost:${PORT}`);
    });

    return server;
};

export const setupApp = (router: express.Router): express.Application => {
    const app: express.Application = express()
        .use(helmet())
        .use(compression())
        .use(cors({
            origin: config.core.websiteUrl,
            credentials: true,
        }))
        .use(bodyParser.json())
        .use(cookieParser())
        .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const baseUrl = getServerURL(req);
            // eslint-disable-next-line no-param-reassign
            req.baseServerUrl = baseUrl;
            next();
        })
        .use(deserializeSession)
        .enable("trust proxy")
        .use("/v1", router);

    app.use("*", (req: express.Request, res: express.Response) => {
        // structured "404 not found" error response
        res.status(404).send({
            message: "Not Found",
            code: 404,
        });
    });

    return app;
};

export const setupAxios = () => {
    const axios = Axios.create({
        timeout: 2500,
        validateStatus: () => true,
    });

    return axios;
};

export const setupWebsocketServer = (server: http.Server) => {
    const io = new socketio.Server<ClientToServerEvents, ServerToClientEvents>(server, {
        cors: {
            origin: config.core.websiteUrl,
            credentials: true,
        },
    });

    return io;
};

export const setupGoogleOAuth2 = () => {
    const googleClient = new google.auth.OAuth2({
        clientId: config.auth.google.clientId,
        clientSecret: config.auth.google.clientSecret,
        redirectUri: config.auth.google.callbackUrl,
    });

    googleClient.on("tokens", tokens => {
        if (tokens.refresh_token) {
            // store refresh_token in your database
            console.log(tokens.refresh_token);
        };
        console.log(tokens.access_token);
    });

    return googleClient;
};

export const setupMulter = (): multer => {
    return multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSie: 8 * 1024 * 1024,
        },
    });
};
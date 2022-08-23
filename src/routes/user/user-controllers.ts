
import {
    NextFunction,
    Request,
    Response,
} from "express";
import { Session } from "@prisma/client";
import { database, google } from "../../app";
import { AppError } from "../../utils/errors";
import { genRanId } from "../../utils/core";
import { createSession } from "../../utils/auth";
import {
    signup,
    login as checkPassword,
} from "../../utils/cryptography";

import validation from "./user-validation";
import utils from "./user-utils";
import config from "../../config";

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userValidation = validation.validateNewUser(req.body);

        if (!userValidation.success) throw new AppError(400, "message validation error\n" + userValidation.error);

        const {
            name,
            email,
            password,
            confirmPassword,
        } = userValidation.data;

        if (password !== confirmPassword) throw new AppError(400, "passwords do not match");

        const existingUser = await database.user.findFirst({
            where: { email },
        });

        if (existingUser) throw new AppError(400, "user with this email already exists");

        const newUser = signup(email, password);

        const user = await database.user.create({
            data: {
                id: genRanId("user"),
                name,
                email,
                password: newUser.password,
            },
        });

        const session = await createSession(user.id);

        utils
            .setClientSessionCookie(res, session.id)
            .status(201)
            .send(session);
    } catch (err) {
        next(err);
    };
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const user = await database.user.findFirst({
            where: { email },
        });

        if (!user) throw new AppError(400, "account not found");

        const isCorrectPassword = checkPassword(user.password, password);
        if (!isCorrectPassword) throw new AppError(400, "incorrect password");

        let session: Session;

        const existingSession = await database.session.findFirst({
            where: { userId: user.id },
        });

        if (existingSession)
            session = await database.session.update({
                where: { id: existingSession.id },
                data: {
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                },
            });
        else {
            session = await createSession(user.id);
            session;
        };

        utils
            .setClientSessionCookie(res, session.id)
            .send(session);
    } catch (err) {
        next(err);
    };
};

const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res
            .clearCookie("session", utils.generateSessionCookieOptions())
            .sendStatus(204);
    } catch (err) {
        next(err);
    };
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AppError(401, "not authenticated");

        const user = await database.user.findFirst({
            where: { id: req.user.id },
            include: {
                organizations: true,
            },
        });
        if (!user) throw new AppError(401, "user not found");
    
        res.send(user);
    } catch (err) {
        next(err);
    }
};

const authGoogle = (req: Request, res: Response, next: NextFunction) => {
    try {
        const scopes = [ "https://www.googleapis.com/auth/userinfo.email" ];

        const url = google.generateAuthUrl({
            // eslint-disable-next-line camelcase
            access_type: "offline",
            scope: scopes,
        });

        res.redirect(url);
    } catch (err) {
        next(err);
    };
};

const callbackGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authCode = req.query.code?.toString();
        if (!authCode)
            return res.redirect(`${config.core.websiteUrl[0]}/auth/login?error=missing_auth_code`);

        const { tokens } = await google.getToken(authCode);
        if (!tokens)
            return res.redirect(`${config.core.websiteUrl[0]}/auth/login?error=invalid_auth_code`);

        google.setCredentials(tokens);

        res.redirect(`${config.core.websiteUrl[0]}/dashboard`);
    } catch (err) {
        next(err);
    };
};

export {
    create,
    login,
    logout,
    get,
    authGoogle,
    callbackGoogle,
};
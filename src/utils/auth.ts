import {
    Request,
    Response,
    NextFunction,
} from "express";
import {
    AES,
    enc,
} from "crypto-js";
import { Session, User } from "@prisma/client";

import config from "../config";
import { database } from "../app";

import { genRanId } from "./core";

export const createSession = async (userId: string): Promise<Session> => {
    const session = await database.session.create({
        data: {
            id: genRanId("sesh"),
            userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    });

    return session;
};

const fetchSession = async (sessionId: string): Promise<Session & { user: User } | null> => {
    const session = await database.session.findFirst({
        where: { id: sessionId },
        include: { user: true },
    });

    return session;
};

const deleteSession = async (sessionId: string): Promise<void> => {
    await database.session.delete({
        where: { id: sessionId },
    });
};

export const encryptString = (string: string) => {
    return AES.encrypt(string, config.auth.encryptSecret).toString();
};

const decryptString = (string: string) => {
    return AES.decrypt(string, config.auth.encryptSecret).toString(enc.Utf8);
};

export const deserializeSession = async (req: Request, res: Response, next: NextFunction) => {
    // I encrypt the session id but I honestly don't know if I need to
    const encryptedSessionId = req.cookies.session;
    if (!encryptedSessionId || encryptedSessionId === null) return next();

    const sessionId = decryptString(encryptedSessionId);

    const session = await fetchSession(sessionId);

    if (!session) return next();

    if (Date.now() > new Date(session.expiresAt).getTime()) {
        next();
        await deleteSession(sessionId);
        return;
    };

    // eslint-disable-next-line no-param-reassign
    req.user = session.user;

    next();
};
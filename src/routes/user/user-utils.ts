
import express from "express";
import { encryptString } from "./../../utils/auth";
import config from "../../config";

const generateSessionCookieOptions = (): {
    httpOnly: boolean;
    maxAge: number;
    sameSite: "strict" | "lax" | "none";
    secure: boolean;
} => {
    return {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: config.core.prod ? "none" : "lax",
        secure: config.core.prod,
    };
};

const setClientSessionCookie = (res: express.Response, sessionId: string): express.Response => {
    return res.cookie("session", encryptString(sessionId), generateSessionCookieOptions());
};

export default Object.freeze({
    generateSessionCookieOptions,
    setClientSessionCookie,
});
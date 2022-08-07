/* eslint-disable object-curly-newline */
import { Request } from "express";
import { axios } from "../app";
import { AppError } from "./errors";
import { AxiosRequestConfig } from "axios";

export const getServerURL = (req: Request): string => {
    return `${req.protocol}://${req.get("host")}`;
};

// make a request to the server itself
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const internalRequest = async (req: Request, path: string, options?: AxiosRequestConfig): Promise<any> => {
    const {
        data,
        status,
    } = await axios(req.baseServerUrl + "/api/v1" + path, {
        method: "GET",
        headers: {
            "cookie": Object.keys(req.cookies)
                .map(key => `${key}=${req.cookies[key]}`)
                .join("; "),
        },
        ...options,
    });

    if (status > 299) throw new AppError(status, data.message);

    return data;
};

export const genRanId = (prefix: string, size = 16) => {
    const id = [ ...Array(size) ].map(() => Math.floor(Math.random() * 36).toString(36)).join("");
    return `${prefix}_${id}`;
};
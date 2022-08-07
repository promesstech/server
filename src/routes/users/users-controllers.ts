import {
    NextFunction,
    Request,
    Response,
} from "express";
import { AppError } from "../../utils/errors";
import { genRanId } from "../../utils/core";

import repositories from "./users-repositories";
import validation from "./users-validation";
import {
    signup,
    login as userLogin,
} from "../../utils/cryptography";

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        email,
        password,
        confirmPassword,
    } = req.body;

    try {
        const existingUser = await repositories.getUserByEmail(email);
        if (existingUser) throw new AppError(400, "user already exists");

        if (password !== confirmPassword) throw new AppError(400, "passwords do not match");

        const error = validation.validateUser({
            email,
            password,
        });

        if (error) throw new AppError(400, error);

        const user = signup(email, password);

        const newUser = await repositories.createUser({
            id: genRanId("user"),
            name,
            ...user,
            avatar: {
                id: genRanId("av"),
                url: "https://storage.googleapis.com/alertbot-images/assets/discord_default_avatar.png",
            },
            createdAt: Date.now(),
        });

        const session = await repositories.createSession({
            id: genRanId("session"),
            expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
            data: JSON.stringify(newUser),
        });
        if (!session) throw new AppError(400, "there was an error creating your session");

        // TODO: encrypt token (AES)

        res.setHeader("Set-Cookie", `session=${session.id}; Path=/; Max-Age=${session.expiresAt - Date.now()}; SameSite=None; Secure; HttpOnly`);
        res.send(session);
    } catch (err) {
        next(err);
    };
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password,
    } = req.body;

    try {
        const user = await repositories.getUserByEmail(email);
        if (!user) throw new AppError(400, "user does not exist");

        const isValid = userLogin(user.password, password);
        if (!isValid) throw new AppError(401, "invalid password");

        res.send(user);
    } catch (err) {
        next(err);
    };
};

const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        ownerId,
    } = req.body;

    try {
        const owner = await repositories.getUser(ownerId);
        if (!owner) throw new AppError(400, "user does not exist");

        const role = await repositories.createRole({
            id: genRanId("role"),
            name: "Owner",
        });
        if (!role) throw new AppError(400, "there was an error create your organization");

        const newOrganization = await repositories.createOrganization({
            id: genRanId("org"),
            name,
            members: [ {
                ...owner,
                role,
            } ],
            createdAt: Date.now(),
        });

        res.send(newOrganization);
    } catch (err) {
        next(err);
    };
};

export {
    create,
    login,
    createOrganization,
};
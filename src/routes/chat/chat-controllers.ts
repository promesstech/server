import {
    NextFunction,
    Request,
    Response,
} from "express";
import { ChatType } from "@prisma/client";

import { database } from "../../app";
import { genRanId } from "../../utils/core";
import { AppError } from "../../utils/errors";

import validation from "./chat-validation";

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatValidation = validation.validateChat(req.body);

        if (!chatValidation.success) throw new AppError(400, "chat validation error");

        const {
            name,
            type,
            organizationId,
        } = chatValidation.data;

        if (type === "ORGANIZATION_CHAT" && !organizationId) throw new AppError(400, "organizationId is required for a chat of type ORGANIZATION_CHAT");

        const organization = await database.organization.findFirst({
            where: { id: organizationId },
        });

        // chats aren't necessarily created by an organization
        // since they can be dm or group chats (created by users)
        // so we need to check if the organization exists
        if (organizationId && !organization) throw new AppError(400, "organization not found");

        const chat = await database.chat.create({
            data: {
                id: genRanId("chat"),
                name,
                type: type as ChatType,
                organizationId,
            },
        });

        res.status(201).send(chat);
    } catch (err) {
        next(err);
    };
};

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messageValidation = validation.validateMessage({
            ...req.body,
            chatId: req.params.id,
        });

        if (!messageValidation.success) throw new AppError(400, "message validation error");

        const {
            content,
            chatId,
            authorId,
        } = messageValidation.data;
        
        const start = Date.now();
        const chat = await database.chat.findFirst({
            where: { id: chatId },
        });

        if (!chat) throw new AppError(400, "chat not found");
        console.log(`${Date.now() - start}ms`);

        const message = await database.message.create({
            data: {
                id: genRanId("message"),
                content,
                chatId,
                authorId,
            },
        });

        res.status(201).send(message);
    } catch (err) {
        next(err);
    };
};

export {
    create,
    createMessage,
};
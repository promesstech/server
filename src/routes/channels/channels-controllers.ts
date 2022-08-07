import {
    NextFunction,
    Request,
    Response,
} from "express";
import { AppError } from "../../utils/errors";
import { genRanId } from "../../utils/core";

import repositories, { Message } from "./channels-repositories";
import usersRepositories, { User } from "../users/users-repositories";

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        organizationId,
    } = req.body;
    
    try {
        const organization = await usersRepositories.getOrganization(organizationId);
        if (!organization) throw new AppError(400, "organization not found");

        const newChannel = await repositories.createChannel({
            id: genRanId("channel"),
            name,
            organizationId,
        });

        res.send(newChannel);
    } catch (err) {
        next(err);
    };
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params;

    try {
        const channel = await repositories.getChannel(channelId);
        if (!channel) throw new AppError(400, "channel not found");

        res.send(channel);
    } catch (err) {
        next(err);
    };
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { organizationId } = req.query;

    try {
        const channels = await repositories.getAllChannels(organizationId);
        res.send(channels);
    } catch (err) {
        next(err);
    };
};

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params;
    if (!channelId) throw new AppError(400, "channel id is required");

    const {
        content,
        authorId,
    } = req.body;

    try {
        const channel = await repositories.getChannel(channelId);
        if (!channel) throw new AppError(400, "channel not found");

        const user = await usersRepositories.getUser(authorId);
        if (!user) throw new AppError(400, "user not found");

        const newMessage = await repositories.createMessage({
            id: genRanId("msg"),
            content: content,
            channelId,
            authorId,
            createdAt: Date.now(),
        });

        res.status(201).send(newMessage);
    } catch (err) {
        next(err);
    };
};

const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    const {
        channelId,
        messageId,
    } = req.params;

    try {
        const channel = await repositories.getChannel(channelId);
        if (!channel) throw new AppError(400, "channel not found");
        
        const message = await repositories.getMessage(messageId);
        if (!message) throw new AppError(400, "message not found");

        res.send(message);
    } catch (err) {
        next(err);
    };
};

const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params;
    if (!channelId) throw new AppError(400, "channel id is required");

    try {
        const channel = await repositories.getChannel(channelId);
        if (!channel) throw new AppError(400, "channel not found");

        const messages = await repositories.getAllMessages(channelId);

        const userIds = new Set<string>();

        messages.forEach(message => userIds.add(message.authorId));

        const users = await usersRepositories.getUsers(Array.from(userIds));
        const newMessages: (Message & { author: User | undefined })[] = [];
        
        messages.forEach(message => {
            const user = users.find(user => user.id === message.authorId);

            newMessages.push({
                ...message.toObject(),
                author: user,
            });
        });

        res.send(newMessages);
    } catch (err) {
        next(err);
    };
};

export {
    create,
    get,
    getAll,
    createMessage,
    getMessage,
    getAllMessages,
};
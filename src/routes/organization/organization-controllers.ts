import {
    NextFunction,
    Request,
    Response,
} from "express";
import { database } from "../../app";
import { AppError } from "../../utils/errors";
import { genRanId } from "../../utils/core";

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        creatorId,
    } = req.body;
    
    try {
        if (!name || !creatorId) throw new AppError(400, "missing 'name' or 'creatorId'");

        const creator = await database.user.findFirst({
            where: {
                id: creatorId,
            },
        });

        if (!creator) throw new AppError(400, "creator user not found");

        const creatorRoleId = genRanId("role");
        const creatorMemberId = genRanId("member");

        const [ organization ] = await database.$transaction([
            database.organization.create({
                data: {
                    id: genRanId("org"),
                    name,
                    creatorId,
                    chats: {
                        createMany: {
                            data: [
                                {
                                    id: genRanId("chat"),
                                    name: "general",
                                    type: "ORGANIZATION_CHAT",
                                },
                            ],
                        },
                    },
                    roles: {
                        createMany: {
                            data: [
                                {
                                    id: creatorRoleId,
                                    name: "Creator",
                                    level: 0,
                                },
                            ],
                        },
                    },
                    members: {
                        createMany: {
                            data: [
                                {
                                    id: creatorMemberId,
                                    userId: creatorId,
                                    name: creator.name,
                                },
                            ],
                        },
                    },
                },
            }),
            database.member.update({
                where: {
                    id: creatorMemberId,
                },
                data: {
                    roles: {
                        connect: {
                            id: creatorRoleId,
                        },
                    },
                },
            }),
        ]);

        res.status(201).send(organization);
    } catch (err) {
        next(err);
    };
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const {
        id,
    } = req.params;

    try {
        const organization = await database.organization.findFirst({
            where: {
                id,
            },
        });

        if (!organization) throw new AppError(400, "organization not found");

        res.send(organization);
    } catch (err) {
        next(err);
    };
};

export {
    create,
    get,
};
import { z } from "zod";
import { ChatType } from "@prisma/client";

const validateChat = (chat: {
    name: string;
    type: string;
    organizationId: string;
}) => {
    const ChatSchema = z.object({
        name: z.string(),
        type: z.enum(Object.values(ChatType) as [string, ...string[]]),
        organizationId: z
            .string()
            .optional(),
    });

    return ChatSchema.safeParse(chat);
};

const validateMessage = (message: {
    content: string;
    chatId: string;
    authorId: string;
}) => {
    const MessageSchema = z.object({
        content: z
            .string()
            .min(1)
            .max(512),
        chatId: z.string(),
        authorId: z.string(),
    });

    return MessageSchema.safeParse(message);
};

export default Object.freeze({
    validateChat,
    validateMessage,
});
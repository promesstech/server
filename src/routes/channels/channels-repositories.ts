/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    model,
    Schema,
    Document,
} from "mongoose";
import {
    IdType,
    UniqueIdType,
    NameType,
} from "../../utils/database";

interface Channel {
    id: string;
    name: string;
    organizationId: string;
};

export interface Message {
    id: string;
    content: string;
    channelId: string;
    authorId: string;
    createdAt: number;
};

const ChannelType = {
    id: UniqueIdType,
    name: NameType,
    organizationId: IdType,
};

const MessageType = {
    id: UniqueIdType,
    content: NameType,
    channelId: IdType,
    authorId: IdType,
    createdAt: {
        type: Number,
        required: true,
    },
};

const channelSchema = new Schema<Channel>(ChannelType);
const messageSchema = new Schema<Message>(MessageType);

const channelCollection = model<Channel>("channel", channelSchema);
const messageCollection = model<Message>("message", messageSchema);

const createChannel = async (channel: Channel): Promise<Channel> => {
    const newChannel = await channelCollection.create(channel);
    return newChannel;
};

const createMessage = async (message: Message): Promise<Message> => {
    const newMessage = await messageCollection.create(message);
    return newMessage;
};

const getChannel = async (id: string): Promise<Channel | null> => {
    const channel = await channelCollection.findOne({ id });
    return channel;
};

const getAllChannels = async (organizationId): Promise<Channel[]> => {
    const channels = await channelCollection.find({ organizationId });
    return channels;
};

const getMessage = async (id: string): Promise<Message | null> => {
    const message = await messageCollection.findOne({ id });
    return message;
};

const getAllMessages = async (channelId: string): Promise<(Message & Document)[]> => {
    const messages = await messageCollection
        .find({ channelId })
        .limit(100);
    return messages;
};

export default Object.freeze({
    createChannel,
    createMessage,
    getChannel,
    getAllChannels,
    getMessage,
    getAllMessages,
});
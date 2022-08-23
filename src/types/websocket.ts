import {
    PartialMessage,
    Message,
} from "./types";
export interface ClientToServerEvents {
    messageCreate: (message: PartialMessage) => void;
};
export interface ServerToClientEvents {
    message: (message: string) => void;
    connected: () => void;
    messageCreate: (message: Message) => void;
    messageUpdate: () => void;
    messageDelete: () => void;
};
// import ws from "ws";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMap = Record<string, any>;

export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

export interface Emitter<T extends EventMap> {
    on<K extends EventKey<T>>
      (eventName: K, fn: EventReceiver<T[K]>): void;
    off<K extends EventKey<T>>
      (eventName: K, fn: EventReceiver<T[K]>): void;
    emit<K extends EventKey<T>>
      (eventName: K, params: T[K]): void;
};

interface Message {
    content: string;
    channelId: string;
	author: {
		id: string;
		name: string;
		avatar: {
			id: string;
			url: string;
		};
	};
};

export interface WebsocketEvents {
    messageCreate: Message;
    messageCreatePending: Message;
    messageCreateError: Message & { error: string };
	messageDelete: Message;
	messageUpdate: Message;
};
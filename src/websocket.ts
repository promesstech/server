import events from "events";
import websocket from "ws";
import {
    Emitter,
    EventKey,
    EventMap,
    EventReceiver,
    WebsocketEvents,
} from "./types/websocket";
import { logger } from "./utils/logger";

const wss = new websocket.Server({ port: 8999 });
logger.info("WebSocket server is running at http://localhost:8999");

class EventEmitter<T extends EventMap> implements Emitter<T> {
    private emitter = new events.EventEmitter();

    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
        this.emitter.on(eventName, fn);
    };
  
    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
        this.emitter.off(eventName, fn);
    };
  
    emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
        this.emitter.emit(eventName, params);
    };
};

const WebsocketServer = new EventEmitter<WebsocketEvents>();

wss.on("connection", socket => {
    // logger.info("connection made");

    socket.on("message", (message: string) => {
        if (!message) return;

        const {
            event,
            data,
        } = JSON.parse(message.toString());

        WebsocketServer.emit(event, data);
    });
});

export {
    WebsocketServer,
    wss,
};
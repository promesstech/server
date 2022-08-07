import { genRanId } from "../../utils/core";
import {
    WebsocketServer,
    wss,
} from "../../websocket";
import { axios } from "../../app";

WebsocketServer.on("messageCreate", message => {
    const messageData = {
        ...message,
        id: genRanId("msg"),
        createdAt: Date.now(),
    };
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            event: "messageCreatePending",
            data: messageData,
        }));
    });
    // database write
    axios.post(`http://localhost:50451/v1/channels/${messageData.channelId}/messages`, messageData).then(res => {
        if (res.status === 201)
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    event: "messageCreate",
                    data: messageData,
                }));
            });
        else
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    event: "messageCreateError",
                    data: {
                        ...messageData,
                        error: res.data.message || "error",
                    },
                }));
            });
    });
});
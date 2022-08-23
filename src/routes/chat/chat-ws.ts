import type { Message } from "../../types";
import { io } from "../../app";
import { internalRequest } from "../../utils/core";

io.on("connection", (socket) => {
    socket.emit("connected");
    
    socket.on("messageCreate", async message => {
        try {
            const res: Message = await internalRequest(`/chat/${message.chatId}/message`, {
                method: "POST",
                data: message,
            });
    
            io.emit("messageCreate", res);
        } catch (err) {
            // send some error event to the client
        };
    });
});
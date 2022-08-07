import { Router } from "express";
const router = Router();

import {
    create,
    get,
    getAll,
    createMessage,
    getMessage,
    getAllMessages,
} from "./channels-controllers";

router.post("/", create);
router.get("/", getAll);
router.get("/:channelId", get);
router.post("/:channelId/messages", createMessage);
router.get("/:channelId/messages", getAllMessages);
router.get("/:channelId/messages/:messageId", getMessage);

export default router;
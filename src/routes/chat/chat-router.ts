import { Router } from "express";
const router = Router();

import {
    create,
    createMessage,
} from "./chat-controllers";

router.post("/", create);
router.post("/:id/message", createMessage);

export default router;
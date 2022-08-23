import { Router } from "express";
const router = Router();

import {
    create,
    get,
} from "./organization-controllers";

router.post("/", create);
router.get("/:id", get);

export default router;
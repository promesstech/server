import { Router } from "express";
const router = Router();

import {
    create,
    createOrganization,
} from "./users-controllers";

router.post("/signup", create);
router.post("/organization", createOrganization);

export default router;
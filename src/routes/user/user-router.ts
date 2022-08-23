import { Router } from "express";
const router = Router();

import {
    create,
    login,
    logout,
    get,
    authGoogle,
    callbackGoogle,
} from "./user-controllers";

router.post("/", create);
router.post("/login", login);
router.get("/logout", logout);
router.get("/", get);
router.get("/auth/google", authGoogle);
router.get("/auth/google/callback", callbackGoogle);

export default router;
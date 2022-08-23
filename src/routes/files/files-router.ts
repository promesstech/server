import { Router } from "express";
import { multer } from "../../app";
const router = Router();

import {
    upload,
} from "./files-controllers";

router.post("/", multer.single("imgfile"), upload);

export default router;
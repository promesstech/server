import { Router } from "express";

import organizationRouter from "./routes/organization";
import chatRouter from "./routes/chat";
import userRouter from "./routes/user";
import filesRouter from "./routes/files";

export default (app: Router) => {
    app.use("/organization", organizationRouter);
    app.use("/chat", chatRouter);
    app.use("/user", userRouter);
    app.use("/files", filesRouter);
};
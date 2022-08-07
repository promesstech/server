import { Router } from "express";

import channelsRouter from "./routes/channels";
import usersRouter from "./routes/users";

export default (app: Router) => {
    app.use("/channels", channelsRouter);
    app.use("/users", usersRouter);
};
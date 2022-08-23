import {
    NextFunction,
    Request,
    Response,
} from "express";

const upload = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    };
};

export {
    upload,
};
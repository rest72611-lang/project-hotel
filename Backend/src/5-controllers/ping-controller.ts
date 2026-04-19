import express, { NextFunction, Request, Response, Router } from "express";
import { StatusCode } from "../3-models/enums";

class PingController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/ping", this.ping);
    }

    private async ping(request: Request, response: Response, next: NextFunction) {
        try {
            response.status(StatusCode.Ok).send("pong");
        }
        catch (err) {
            next(err);
        }
    }
}

export const pingController = new PingController();

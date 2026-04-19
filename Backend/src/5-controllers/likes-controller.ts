import express, { NextFunction, Request, Response, Router } from "express";
import { likesService } from "../4-services/likes-service";

import { StatusCode } from "../3-models/enums";
import { verifyLoggedIn } from "../6-middleware/verify-logged-in";

class LikesController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/likes/:vacationId", verifyLoggedIn.verify, this.addLike);
        this.router.delete("/api/likes/:vacationId", verifyLoggedIn.verify, this.removeLike);
    }

    private async addLike(request: Request, response: Response, next: NextFunction) {
        try {
            const user = (request as any).user;
            const vacationId = +request.params.vacationId;

            await likesService.addLike(user.userId, vacationId);
            response.sendStatus(StatusCode.Created);
        }
        catch (err) {
            next(err);
        }
    }

    private async removeLike(request: Request, response: Response, next: NextFunction) {
        try {
            const user = (request as any).user;
            const vacationId = +request.params.vacationId;

            await likesService.removeLike(user.userId, vacationId);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err) {
            next(err);
        }
    }

}

export const likesController = new LikesController();
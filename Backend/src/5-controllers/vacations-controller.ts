import express, { NextFunction, Request, Response, Router } from "express";
import { vacationsService } from "../4-services/vacations-service";


import { StatusCode } from "../3-models/enums";
import { verifyAdmin } from "../6-middleware/verify-admin";
import { verifyLoggedIn } from "../6-middleware/verify-logged-in";

// Maps HTTP concerns to service calls and leaves business rules to the service layer.
class VacationsController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", verifyLoggedIn.verify, this.getAllVacations);
        this.router.post("/api/vacations", verifyAdmin.verify, this.addVacation);
        this.router.put("/api/vacations/:vacationId", verifyAdmin.verify, this.updateVacation);
        this.router.delete("/api/vacations/:vacationId", verifyAdmin.verify, this.deleteVacation);
    }

    private async getAllVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const user = (request as any).user;
            // The current user id is required because the query computes the personalized isLiked flag.
            const vacations = await vacationsService.getAllVacations(user.userId);
            response.status(StatusCode.Ok).json(vacations);
        }
        catch (err) {
            next(err);
        }
    }

    private async addVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const vacation = {
                ...request.body,
                // Multipart form fields arrive as strings, so numeric normalization happens here.
                price: +request.body.price,
                image: request.files?.image as any
            };

            const addedVacation = await vacationsService.addVacation(vacation);
            response.status(StatusCode.Created).json(addedVacation);
        }
        catch (err) {
            next(err);
        }
    }

    private async updateVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const vacationId = +request.params.vacationId;

            const vacation = {
                ...request.body,
                price: +request.body.price,
                image: request.files?.image as any
            };

            const updatedVacation = await vacationsService.updateVacation(vacationId, vacation);
            response.status(StatusCode.Ok).json(updatedVacation);
        }
        catch (err) {
            next(err);
        }
    }

    private async deleteVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const vacationId = +request.params.vacationId;
            await vacationsService.deleteVacation(vacationId);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err) {
            next(err);
        }
    }

}

export const vacationsController = new VacationsController();

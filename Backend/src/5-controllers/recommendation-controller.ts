import express, { NextFunction, Request, Response, Router } from "express";
import { recommendationService } from "../4-services/recommendation-service";
import { StatusCode } from "../3-models/enums";
import { verifyLoggedIn } from "../6-middleware/verify-logged-in";

class RecommendationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/recommendations", verifyLoggedIn.verify, this.getRecommendation);
    }

    private async getRecommendation(request: Request, response: Response, next: NextFunction) {
        try {
            const destination = request.body.destination;
            const recommendation = await recommendationService.getRecommendation(destination);
            response.status(StatusCode.Ok).json(recommendation);
        }
        catch (err) {
            next(err);
        }
    }
}

export const recommendationController = new RecommendationController();
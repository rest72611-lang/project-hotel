import express, { NextFunction, Request, Response, Router } from "express";
import { recommendationService } from "../4-services/recommendation-service";
import { StatusCode } from "../3-models/enums";
import { verifyLoggedIn } from "../6-middleware/verify-logged-in";

// The controller only exposes the AI recommendation feature to authenticated users.
class RecommendationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/recommendations", verifyLoggedIn.verify, this.getRecommendation);
    }

    private async getRecommendation(request: Request, response: Response, next: NextFunction) {
        try {
            // The service owns prompt construction and response parsing; the controller just forwards input.
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

import express, { NextFunction, Request, Response, Router } from "express";
import { aiService } from "../Mcp/ai-service";


class AiController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/ai/ask", this.ask);
    }

    private async ask(request: Request, response: Response, next: NextFunction) {
        try {
            const { userId, question } = request.body;
            const answer = await aiService.askQuestion(userId, question);
            response.json(answer);
        }
        catch (err) {
            next(err);
        }
    }
}

export const aiController = new AiController();
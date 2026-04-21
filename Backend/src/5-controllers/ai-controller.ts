import express, { NextFunction, Request, Response, Router } from "express";
import { aiService } from "../Mcp/ai-service";
import { verifyLoggedIn } from "../6-middleware/verify-logged-in";

// Thin adapter between the HTTP endpoint and the MCP-backed AI orchestration service.
class AiController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/ai/ask", verifyLoggedIn.verify, this.ask);
    }

    private async ask(request: Request, response: Response, next: NextFunction) {
        try {
            const user = (request as any).user;
            const { question } = request.body;
            // The current user identity must come from the verified token, not from client-provided input.
            const answer = await aiService.askQuestion(user.userId, question);
            response.json(answer);
        }
        catch (err) {
            next(err);
        }
    }
}

export const aiController = new AiController();

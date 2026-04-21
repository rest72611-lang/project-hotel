import express, { NextFunction, Request, Response, Router } from "express";
import { authService } from "../4-services/auth-service";
import { StatusCode } from "../3-models/enums";

// Auth routes stay intentionally small: parse request, delegate, return token.
class AuthController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/auth/register", this.register);
        this.router.post("/api/auth/login", this.login);
    }

    private async register(request: Request, response: Response, next: NextFunction) {
        try {
            const token = await authService.register(request.body);
            // Returning the token immediately lets the client treat register as an authenticated flow.
            response.status(StatusCode.Created).json(token);
        }
        catch (err) {
            next(err);
        }
    }

    private async login(request: Request, response: Response, next: NextFunction) {
        try {
            const token = await authService.login(request.body);
            response.status(StatusCode.Ok).json(token);
        }
        catch (err) {
            next(err);
        }
    }

}

export const authController = new AuthController();

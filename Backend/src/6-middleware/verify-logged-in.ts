import { NextFunction, Request, Response } from "express";
import { cyber } from "../2-utils/cyber";
import { UnauthorizedError } from "../3-models/client-errors";

class VerifyLoggedInMiddleware {

    public verify(request: Request, response: Response, next: NextFunction): void {
        try {
            const authHeader = request.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new UnauthorizedError("You are not logged in.");
            }

            const token = authHeader.substring(7);
            const user = cyber.verifyToken(token);

            (request as any).user = user;

            next();
        }
        catch (err) {
            next(err);
        }
    }

}

export const verifyLoggedIn = new VerifyLoggedInMiddleware();
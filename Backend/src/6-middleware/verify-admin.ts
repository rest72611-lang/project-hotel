import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../3-models/client-errors";
import { Role } from "../3-models/enums";
import { verifyLoggedIn } from "./verify-logged-in";

// Builds on top of the logged-in check so admin routes share the same token parsing flow.
class VerifyAdminMiddleware {

    public verify(request: Request, response: Response, next: NextFunction): void {
        verifyLoggedIn.verify(request, response, (err?: any) => {
            if (err) {
                next(err);
                return;
            }

            const user = (request as any).user;

            if (user.role !== Role.Admin) {
                // Keeping this as a separate error type makes authorization failures easy to distinguish.
                next(new ForbiddenError("You are not admin."));
                return;
            }

            next();
        });
    }

}

export const verifyAdmin = new VerifyAdminMiddleware();

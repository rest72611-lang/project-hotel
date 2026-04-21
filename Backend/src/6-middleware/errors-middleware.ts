import { NextFunction, Request, Response } from "express";
import { appConfig } from "../2-utils/app-config";
import { RouteNotFoundError } from "../3-models/client-errors";
import { StatusCode } from "../3-models/enums";

// Final error boundary for the Express app.
class ErrorsMiddleware {

    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {
        console.error(err);
        const status = err.status || StatusCode.InternalServerError;
        const isServerError = status >= 500 && status <= 599;
        // Production hides internal details while keeping validation/auth messages visible.
        const message = appConfig.isProduction && isServerError
            ? "Some error, please try again."
            : err.message;

        response.status(status).json({ message });
    }

    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        // Unmatched routes are converted into the same error flow as application exceptions.
        next(new RouteNotFoundError(request.originalUrl));
    }

}

export const errorsMiddleware = new ErrorsMiddleware();

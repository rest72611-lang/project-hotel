import jwt from "jsonwebtoken";
import { appConfig } from "./app-config";
import { UnauthorizedError } from "../3-models/client-errors";
import { Role } from "../3-models/enums";

export interface TokenPayload {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}

// Thin JWT wrapper used by auth services and middleware.
class Cyber {

    public createToken(payload: TokenPayload): string {
        // The token embeds the minimal identity data the frontend needs after login.
        return jwt.sign(payload, appConfig.jwtSecret as string, { expiresIn: "1h" });
    }

    public verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, appConfig.jwtSecret as string) as TokenPayload;
        }
        catch {
            // Normalizing JWT failures into a domain error keeps middleware responses consistent.
            throw new UnauthorizedError("Invalid token.");
        }
    }
}

export const cyber = new Cyber();

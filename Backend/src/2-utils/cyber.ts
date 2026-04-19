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

class Cyber {

    public createToken(payload: TokenPayload): string {
        return jwt.sign(payload, appConfig.jwtSecret as string, { expiresIn: "12h" });
    }

    public verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, appConfig.jwtSecret as string) as TokenPayload;
        }
        catch {
            throw new UnauthorizedError("Invalid token.");
        }
    }
}

export const cyber = new Cyber();
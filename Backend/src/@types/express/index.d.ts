import { TokenPayload } from "../../2-utils/cyber";

declare global {
    namespace Express {
        interface Request {
            user: TokenPayload;
        }
    }
}

export { };

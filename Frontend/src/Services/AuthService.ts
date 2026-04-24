import { CredentialsModel } from "../Models/CredentialsModel";
import { RegisterModel } from "../Models/RegisterModel";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { api } from "./Service";

interface DecodedTokenPayload {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    exp?: number;
}

// Keeps auth state in one place so UI components can stay mostly declarative.
class AuthService {
    private readonly authChangedEvent = "auth-changed";

    public getUser(): UserModel | null {
        const json = localStorage.getItem("user");
        if (json) {
            return JSON.parse(json) as UserModel;
        }

        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            // Rebuild the cached user from the token if localStorage lost the serialized user object.
            return this.saveToken(token);
        }
        catch {
            this.logout();
            return null;
        }
    }

    public isLoggedIn(): boolean {
        return !!this.getUser();
    }

    public isAdmin(): boolean {
        return this.getUser()?.role?.toLowerCase() === "admin";
    }

    public logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Components subscribe to this event so logout propagates without a hard reload.
        window.dispatchEvent(new Event(this.authChangedEvent));
    }

    public subscribe(callback: () => void): () => void {
        window.addEventListener(this.authChangedEvent, callback);
        return () => window.removeEventListener(this.authChangedEvent, callback);
    }

    private decodeToken(token: string): DecodedTokenPayload {
        // JWT payloads use base64url, so we normalize them before calling atob.
        const payload = token.split(".")[1];
        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
        const json = atob(paddedPayload);
        return JSON.parse(json) as DecodedTokenPayload;
    }

    private isTokenExpired(payload: DecodedTokenPayload): boolean {
        if (!payload.exp) {
            return false;
        }

        return payload.exp * 1000 < Date.now();
    }

    private saveToken(token: string): UserModel {
        localStorage.setItem("token", token);

        const payload = this.decodeToken(token);

        if (this.isTokenExpired(payload)) {
            throw new Error("Token expired.");
        }

        const user: UserModel = {
            userId: payload.userId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
            token
        };

        localStorage.setItem("user", JSON.stringify(user));
        // The same event is reused for login/register so header and menu refresh immediately.
        window.dispatchEvent(new Event(this.authChangedEvent));
        return user;
    }

    private extractToken(data: any): string {
        // The backend currently returns the raw token string, but this keeps the client tolerant.
        if (typeof data === "string") return data;
        if (data?.token) return data.token;
        return "";
    }

    public async register(registerData: RegisterModel): Promise<UserModel> {
        const response = await api.post(appConfig.registerUrl, registerData);
        const token = this.extractToken(response.data);
        return this.saveToken(token);
    }

    public async login(credentials: CredentialsModel): Promise<UserModel> {
        const response = await api.post(appConfig.loginUrl, credentials);
        const token = this.extractToken(response.data);
        return this.saveToken(token);
    }
}

export const authService = new AuthService();

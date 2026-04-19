import { CredentialsModel } from "../Models/CredentialsModel";
import { RegisterModel } from "../Models/RegisterModel";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { api } from "./Service";

class AuthService {

    public getUser(): UserModel | null {
        const json = localStorage.getItem("user");
        if (!json) return null;
        return JSON.parse(json);
    }

    public isLoggedIn(): boolean {
        return !!localStorage.getItem("token");
    }

    public isAdmin(): boolean {
        return this.getUser()?.role?.toLowerCase() === "admin";
    }

    public logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    private decodeToken(token: string): any {
        const payload = token.split(".")[1];
        const json = atob(payload);
        return JSON.parse(json);
    }

    private saveToken(token: string): UserModel {
        localStorage.setItem("token", token);

        const payload = this.decodeToken(token);

        const user: UserModel = {
            userId: payload.userId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
            token
        };

        localStorage.setItem("user", JSON.stringify(user));
        return user;
    }

    private extractToken(data: any): string {
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
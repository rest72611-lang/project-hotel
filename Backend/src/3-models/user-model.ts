export interface UserModel {
    userId?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    passwordHash?: string;
    role?: string;
}
import Joi from "joi";
import { ValidationError } from "./client-errors";
import { UserModel } from "./user-model";

const userSchema = Joi.object({
    userId: Joi.number().optional(),
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().optional().min(4).max(100),
    passwordHash: Joi.string().optional(),
    role: Joi.string().optional()
});

export function validateUser(user: UserModel): void {
    const result = userSchema.validate(user);
    if (result.error) throw new ValidationError(result.error.message);
}
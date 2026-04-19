import Joi from "joi";
import { ValidationError } from "./client-errors";
import { CredentialsModel } from "./credentials-model";

const credentialsSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(100)
});

export function validateCredentials(credentials: CredentialsModel): void {
    const result = credentialsSchema.validate(credentials);
    if (result.error) throw new ValidationError(result.error.message);
}
import Joi from "joi";
import { ValidationError } from "./client-errors";
import { VacationModel } from "./vacation-model";

const vacationSchema = Joi.object({
    vacationId: Joi.number().optional(),
    destination: Joi.string().required().min(2).max(100),
    description: Joi.string().required().min(2).max(1000),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    price: Joi.number().required().min(0),
    imageName: Joi.string().optional(),
    image: Joi.any().required()
});

export function validateVacation(vacation: VacationModel): void {
    const result = vacationSchema.validate(vacation);
    if (result.error) throw new ValidationError(result.error.message);

    const today = new Date().toISOString().split("T")[0];

    if (vacation.endDate < vacation.startDate) {
        throw new ValidationError("End date can't be before start date.");
    }
    if (vacation.endDate < today) {
    throw new ValidationError("End date can't be in the past.");
}
}
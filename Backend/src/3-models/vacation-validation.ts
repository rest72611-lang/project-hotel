import Joi from "joi";
import { ValidationError } from "./client-errors";
import { VacationModel } from "./vacation-model";

interface ValidateVacationOptions {
    allowPastDates?: boolean;
    requireImage?: boolean;
}

const vacationSchema = Joi.object({
    vacationId: Joi.number().optional(),
    destination: Joi.string().required().min(2).max(100),
    description: Joi.string().required().min(2).max(1000),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    price: Joi.number().required().min(0).max(10000),
    imageName: Joi.string().optional(),
    image: Joi.any().optional()
});

export function validateVacation(
    vacation: VacationModel,
    options: ValidateVacationOptions = {}
): void {
    const result = vacationSchema.validate(vacation);
    if (result.error) throw new ValidationError(result.error.message);

    const requireImage = options.requireImage ?? false;
    const allowPastDates = options.allowPastDates ?? false;
    const today = new Date().toISOString().split("T")[0];

    if (requireImage && !vacation.image) {
        throw new ValidationError("Image is required.");
    }

    if (vacation.endDate < vacation.startDate) {
        throw new ValidationError("End date can't be before start date.");
    }

    if (!allowPastDates) {
        if (vacation.startDate < today) {
            throw new ValidationError("Start date can't be in the past.");
        }
        if (vacation.endDate < today) {
            throw new ValidationError("End date can't be in the past.");
        }
    }
}

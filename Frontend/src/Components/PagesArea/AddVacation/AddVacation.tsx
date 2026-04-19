import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { authService } from "../../../Services/AuthService";

function AddVacation() {

    if (!authService.isLoggedIn()) {
        return <Navigate to="/login" />;
    }

    if (!authService.isAdmin()) {
        return <Navigate to="/vacations" />;
    }

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<VacationModel>();

    const startDate = watch("startDate");

    function getToday(): string {
        return new Date().toISOString().split("T")[0];
    }

    async function submit(vacation: VacationModel): Promise<void> {
        try {
            const imageFile = vacation.image?.[0];

            await vacationService.addVacation(vacation, imageFile);
            notify.success("Vacation added.");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <h2>Add Vacation</h2>

            <label>Destination:</label>
            <br />
            <input
                type="text"
                placeholder="Destination"
                {...register("destination", {
                    required: "Destination is required.",
                    minLength: {
                        value: 2,
                        message: "Destination must be at least 2 characters."
                    },
                    maxLength: {
                        value: 100,
                        message: "Destination can't exceed 100 characters."
                    }
                })}
            />
            <div>{errors.destination?.message}</div>
            <br />

            <label>Description:</label>
            <br />
            <textarea
                placeholder="Description"
                {...register("description", {
                    required: "Description is required.",
                    minLength: {
                        value: 2,
                        message: "Description must be at least 2 characters."
                    },
                    maxLength: {
                        value: 1000,
                        message: "Description can't exceed 1000 characters."
                    }
                })}
            />
            <div>{errors.description?.message}</div>
            <br />

            <label>Start Date:</label>
            <br />
            <input
                type="date"
                min={getToday()}
                {...register("startDate", {
                    required: "Start date is required.",
                    validate: value =>
                        value >= getToday() || "Start date can't be in the past."
                })}
            />
            <div>{errors.startDate?.message}</div>
            <br />

            <label>End Date:</label>
            <br />
            <input
                type="date"
                min={startDate || getToday()}
                {...register("endDate", {
                    required: "End date is required.",
                    validate: value => {
                        if (value < getToday()) return "End date can't be in the past.";
                        if (startDate && value < startDate) return "End date can't be before start date.";
                        return true;
                    }
                })}
            />
            <div>{errors.endDate?.message}</div>
            <br />

            <label>Price:</label>
            <br />
            <input
                type="number"
                placeholder="Price"
                {...register("price", {
                    required: "Price is required.",
                    validate: value =>
                        +value > 0 || "Price must be greater than 0."
                })}
            />
            <div>{errors.price?.message}</div>
            <br />

            <label>Image:</label>
            <br />
            <input
                type="file"
                accept="image/*"
                {...register("image", {
                    required: "Image is required.",
                    validate: value => {
                        const file = value?.[0];
                        if (!file) return "Image is required.";
                        if (!file.type.startsWith("image/")) {
                            return "Selected file must be an image.";
                        }
                        return true;
                    }
                })}
            />
            <div>{errors.image?.message as string}</div>
            <br />

            <button type="submit">Add</button>
        </form>
    );
}

export default AddVacation;
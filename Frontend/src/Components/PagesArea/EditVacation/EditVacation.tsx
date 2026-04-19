import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { authService } from "../../../Services/AuthService";
import "./EditVacation.css";

function EditVacation(){

    if (!authService.isLoggedIn()) {
        return <Navigate to="/login" />;
    }

    if (!authService.isAdmin()) {
        return <Navigate to="/vacations" />;
    }

    const params = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState<File | undefined>();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<VacationModel>();

    const startDate = watch("startDate");

    function getToday(): string {
        return new Date().toISOString().split("T")[0];
    }

    useEffect(() => {
        vacationService.getAllVacations()
            .then(vacations => {
                const found = vacations.find(v => v.vacationId === +params.vacationId!);
                if (!found) {
                    notify.error("Vacation not found.");
                    navigate("/vacations");
                    return;
                }

                setValue("vacationId", found.vacationId);
                setValue("destination", found.destination);
                setValue("description", found.description);
                setValue("startDate", found.startDate.slice(0, 10));
                setValue("endDate", found.endDate.slice(0, 10));
                setValue("price", found.price);
                setValue("imageName", found.imageName);
                setValue("likesCount", found.likesCount);
                setValue("isLiked", found.isLiked);
            })
            .catch(err => notify.error(err));
    }, [params.vacationId, setValue, navigate]);

    async function submit(vacation: VacationModel): Promise<void> {
        try {
            await vacationService.updateVacation(vacation, image);
            notify.success("Vacation updated.");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <h2>Edit Vacation</h2>

            <label>Destination:</label>
            <input
                type="text"
                {...register("destination", {
                    required: "Destination is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                })}
            />
            <span>{errors.destination?.message}</span>

            <label>Description:</label>
            <textarea
                {...register("description", {
                    required: "Description is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                })}
            />
            <span>{errors.description?.message}</span>

            <label>Start Date:</label>
            <input
                type="date"
                min={getToday()}
                {...register("startDate", {
                    required: "Start date is required",
                    validate: value =>
                        value >= getToday() || "Start date can't be in the past"
                })}
            />
            <span>{errors.startDate?.message}</span>

            <label>End Date:</label>
            <input
                type="date"
                min={startDate || getToday()}
                {...register("endDate", {
                    required: "End date is required",
                    validate: value => {
                        if (value < getToday()) return "End date can't be in the past";
                        if (startDate && value < startDate) return "End date can't be before start date";
                        return true;
                    }
                })}
            />
            <span>{errors.endDate?.message}</span>

            <label>Price:</label>
            <input
                type="number"
                {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" }
                })}
            />
            <span>{errors.price?.message}</span>

            <label>Image:</label>
            <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files?.[0])}
            />

            <button type="submit">Update</button>
        </form>
    );
}

export default EditVacation;
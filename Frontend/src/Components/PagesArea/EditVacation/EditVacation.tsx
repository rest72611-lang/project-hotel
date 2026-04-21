import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { authService } from "../../../Services/AuthService";
import "../AdminVacationForm.css";

function EditVacation() {

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
    const imageName = watch("imageName");

    useEffect(() => {
        // Reuses the vacations list instead of adding a dedicated "get by id" frontend endpoint.
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
                setValue("price", Number(found.price));
                setValue("imageName", found.imageName);
                // These extra fields are preserved so the form model stays consistent with the card model.
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
        <div className="AdminVacationPage">
            <div className="AdminVacationCard">
                <div className="AdminVacationIntro">
                    <span className="AdminVacationEyebrow">Admin Workspace</span>
                    <h2>Refine an existing vacation.</h2>
                    <p>
                        Update trip details, adjust pricing and dates, and replace
                        the current image when you want to refresh the listing.
                    </p>
                </div>

                <form className="AdminVacationForm" onSubmit={handleSubmit(submit)}>
                    <div className="AdminVacationFormHeader">
                        <h3>Edit Vacation</h3>
                        <p>Update the vacation details and save your changes.</p>
                    </div>

                    <div className="AdminVacationGrid">
                        <div className="AdminVacationField">
                            <label htmlFor="edit-destination">Destination</label>
                            <input
                                id="edit-destination"
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
                            <div className="AdminVacationError">{errors.destination?.message}</div>
                        </div>

                        <div className="AdminVacationField">
                            <label htmlFor="edit-price">Price</label>
                            <input
                                id="edit-price"
                                type="number"
                                placeholder="Price"
                                step="0.01"
                                {...register("price", {
                                    required: "Price is required.",
                                    valueAsNumber: true,
                                    validate: value => {
                                        if (value < 0) return "Price can't be negative.";
                                        if (value > 10000) return "Price can't be higher than 10,000.";
                                        return true;
                                    }
                                })}
                            />
                            <div className="AdminVacationError">{errors.price?.message}</div>
                        </div>

                        <div className="AdminVacationField">
                            <label htmlFor="edit-start-date">Start Date</label>
                            <input
                                id="edit-start-date"
                                type="date"
                                {...register("startDate", {
                                    required: "Start date is required."
                                })}
                            />
                            <div className="AdminVacationError">{errors.startDate?.message}</div>
                        </div>

                        <div className="AdminVacationField">
                            <label htmlFor="edit-end-date">End Date</label>
                            <input
                                id="edit-end-date"
                                type="date"
                                min={startDate || undefined}
                                {...register("endDate", {
                                    required: "End date is required.",
                                    validate: value => {
                                        if (startDate && value < startDate) return "End date can't be before start date.";
                                        return true;
                                    }
                                })}
                            />
                            <div className="AdminVacationError">{errors.endDate?.message}</div>
                        </div>

                        <div className="AdminVacationField AdminVacationFieldFull">
                            <label htmlFor="edit-description">Description</label>
                            <textarea
                                id="edit-description"
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
                            <div className="AdminVacationError">{errors.description?.message}</div>
                        </div>

                        <div className="AdminVacationField AdminVacationFieldFull">
                            <label htmlFor="edit-image">Replace Image</label>
                            <input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={e => setImage(e.target.files?.[0])}
                            />
                            <p className="AdminVacationHint">
                                Current image: {imageName || "No image saved"}
                            </p>
                        </div>
                    </div>

                    <div className="AdminVacationActions">
                        <button className="AdminVacationPrimaryButton" type="submit">Save Changes</button>
                        <button
                            className="AdminVacationSecondaryButton"
                            type="button"
                            onClick={() => navigate("/vacations")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditVacation;

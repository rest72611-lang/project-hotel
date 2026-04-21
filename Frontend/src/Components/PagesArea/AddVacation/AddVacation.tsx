import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { authService } from "../../../Services/AuthService";
import "../AdminVacationForm.css";

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

    // React Hook Form watch keeps the end-date validation aligned with the selected start date.
    const startDate = watch("startDate");

    function getToday(): string {
        return new Date().toISOString().split("T")[0];
    }

    async function submit(vacation: VacationModel): Promise<void> {
        try {
            // The service expects the selected file as a plain File instance, not a FileList.
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
        <div className="AdminVacationPage">
            <div className="AdminVacationCard">
                <div className="AdminVacationIntro">
                    <span className="AdminVacationEyebrow">Admin Workspace</span>
                    <h2>Create a new vacation offering.</h2>
                    <p>
                        Add a destination, define the trip details, upload an image,
                        and publish a vacation that will appear in the traveler experience.
                    </p>
                </div>

                <form className="AdminVacationForm" onSubmit={handleSubmit(submit)}>
                    <div className="AdminVacationFormHeader">
                        <h3>Add Vacation</h3>
                        <p>Complete the form below to publish a new vacation.</p>
                    </div>

                    <div className="AdminVacationGrid">
                        <div className="AdminVacationField">
                            <label htmlFor="add-destination">Destination</label>
                            <input
                                id="add-destination"
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
                            <label htmlFor="add-price">Price</label>
                            <input
                                id="add-price"
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
                            <label htmlFor="add-start-date">Start Date</label>
                            <input
                                id="add-start-date"
                                type="date"
                                min={getToday()}
                                {...register("startDate", {
                                    required: "Start date is required.",
                                    validate: value =>
                                        value >= getToday() || "Start date can't be in the past."
                                })}
                            />
                            <div className="AdminVacationError">{errors.startDate?.message}</div>
                        </div>

                        <div className="AdminVacationField">
                            <label htmlFor="add-end-date">End Date</label>
                            <input
                                id="add-end-date"
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
                            <div className="AdminVacationError">{errors.endDate?.message}</div>
                        </div>

                        <div className="AdminVacationField AdminVacationFieldFull">
                            <label htmlFor="add-description">Description</label>
                            <textarea
                                id="add-description"
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
                            <label htmlFor="add-image">Image</label>
                            <input
                                id="add-image"
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
                            <div className="AdminVacationError">{errors.image?.message as string}</div>
                        </div>
                    </div>

                    <div className="AdminVacationActions">
                        <button className="AdminVacationPrimaryButton" type="submit">Add Vacation</button>
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

export default AddVacation;

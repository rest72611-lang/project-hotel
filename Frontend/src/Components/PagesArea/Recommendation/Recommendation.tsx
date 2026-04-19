import { useState } from "react";
import { useForm } from "react-hook-form";
import { notify } from "../../../Utils/Notify";

import "./Recommendation.css";
import Spinner from "../ShardArea/Spinner";
import { recommendationService } from "../../../Services/RecommendationService";
import { RecommendationModel } from "../../../Models/RecommendationModel";
import { Navigate } from "react-router-dom";
import { authService } from "../../../Services/AuthService";

interface RecommendationForm {
    destination: string;
}

function Recommendation() {
        if (!authService.isLoggedIn()) {
    return <Navigate to="/login" />;
}



    const [recommendation, setRecommendation] = useState<RecommendationModel | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<RecommendationForm>();

    async function submit(data: RecommendationForm): Promise<void> {
        try {
            setLoading(true);
            setRecommendation(null);

            const response = await recommendationService.getRecommendation(data.destination);
            setRecommendation(response);
        }
        catch (err: any) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    function clearForm(): void {
        reset();
        setRecommendation(null);
    }

    return (
        <div className="RecommendationPage">
            <div className="RecommendationHeader">
                <h2>AI Recommendation</h2>
                <p>קבל רעיונות והמלצות ליעד טיול לפי בחירתך</p>
            </div>

            <form className="RecommendationForm" onSubmit={handleSubmit(submit)}>
                <label>Destination:</label>

                <input
                    type="text"
                    placeholder="Enter destination..."
                    {...register("destination", {
                        required: "יש להזין יעד.",
                        minLength: {
                            value: 2,
                            message: "היעד חייב להכיל לפחות 2 תווים."
                        }
                    })}
                />

                <div className="FieldError">{errors.destination?.message}</div>

                <div className="RecommendationButtons">
                    <button type="submit" disabled={loading}>
                        Get Recommendation
                    </button>

                    <button type="button" onClick={clearForm} disabled={loading}>
                        Clear
                    </button>
                </div>
            </form>

            {loading && <Spinner />}

            {!loading && recommendation && (
                <div className="RecommendationResult">
                    <div className="RecommendationIntroCard">
                        <h3>{recommendation.title}</h3>
                        <p>{recommendation.intro}</p>
                    </div>

                    <div className="RecommendationGrid">
                        {recommendation.recommendations.map((item, index) => (
                            <div key={index} className="RecommendationCard">
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>

                                <div className="HighlightsSection">
                                    <h5>Highlights</h5>
                                    <ul>
                                        {item.highlights.map((highlight, i) => (
                                            <li key={i}>{highlight}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="TipBox">
                                    <strong>Tip:</strong> {item.tip}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Recommendation;

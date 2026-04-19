import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../Models/VacationModel";
import { authService } from "../../../Services/AuthService";
import { appConfig } from "../../../Utils/AppConfig";

interface VacationCardProps {
    vacation: VacationModel;
    onLike: (vacationId: number) => void;
    onUnlike: (vacationId: number) => void;
    onDelete: (vacationId: number) => void;
}

function VacationCard(props: VacationCardProps) {

    const { vacation, onLike, onUnlike, onDelete } = props;
    const isAdmin = authService.isAdmin();
    const navigate = useNavigate();

    const imageUrl = appConfig.imagesUrl + vacation.imageName;

    return (
        <div className="VacationCard">
            <h3>{vacation.destination}</h3>

            <img src={imageUrl} alt={vacation.destination} />

            <p>{vacation.description}</p>
            <p>Start: {new Date(vacation.startDate).toLocaleDateString()}</p>
            <p>End: {new Date(vacation.endDate).toLocaleDateString()}</p>
            <p>Price: {Number(vacation.price).toLocaleString()} ₪</p>
            <p>Likes: {vacation.likesCount}</p>
            <p>{vacation.isLiked === 1 ? "❤️ You liked this vacation" : "🤍 You have not liked this vacation"}</p>

            {!isAdmin && (
                <>
                    {vacation.isLiked === 1 ? (
                        <button onClick={() => onUnlike(vacation.vacationId)}>Unlike</button>
                    ) : (
                        <button onClick={() => onLike(vacation.vacationId)}>Like</button>
                    )}
                </>
            )}

            {isAdmin && (
                <>
                    <button onClick={() => navigate(`/admin/edit-vacation/${vacation.vacationId}`)}>
                        Edit
                    </button>
                    <button onClick={() => onDelete(vacation.vacationId)}>
                        Delete
                    </button>
                </>
            )}
        </div>
    );
}

export default VacationCard;
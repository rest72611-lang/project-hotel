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
            <div className="VacationCardTop">
                <h3>{vacation.destination}</h3>
                <span className={vacation.isLiked === 1 ? "VacationBadge VacationBadgeLiked" : "VacationBadge"}>
                    {vacation.isLiked === 1 ? "Liked" : "Available"}
                </span>
            </div>

            <img src={imageUrl} alt={vacation.destination} />

            <p className="VacationDescription">{vacation.description}</p>

            <div className="VacationMeta">
                <span>Start: {new Date(vacation.startDate).toLocaleDateString()}</span>
                <span>End: {new Date(vacation.endDate).toLocaleDateString()}</span>
                <span>Price: ${Number(vacation.price).toLocaleString()}</span>
                <span>Likes: {vacation.likesCount}</span>
            </div>

            <p className="VacationStatusText">
                {vacation.isLiked === 1 ? "You liked this vacation" : "You have not liked this vacation"}
            </p>

            <div className="VacationActions">
                {!isAdmin && (
                    <>
                    {vacation.isLiked === 1 ? (
                        <button className="VacationActionButton" onClick={() => onUnlike(vacation.vacationId)}>Unlike</button>
                    ) : (
                        <button className="VacationActionButton" onClick={() => onLike(vacation.vacationId)}>Like</button>
                    )}
                    </>
                )}

                {isAdmin && (
                    <>
                    <button className="VacationActionButton" onClick={() => navigate(`/admin/edit-vacation/${vacation.vacationId}`)}>
                        Edit
                    </button>
                    <button className="VacationActionButton VacationDeleteButton" onClick={() => onDelete(vacation.vacationId)}>
                        Delete
                    </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default VacationCard;

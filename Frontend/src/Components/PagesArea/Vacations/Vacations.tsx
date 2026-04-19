import { useEffect, useState } from "react";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./Vacations.css";
import VacationCard from "./VacationCard";
import { authService } from "../../../Services/AuthService";
import { Navigate } from "react-router-dom";

function Vacations() {
    if (!authService.isLoggedIn()) {
    return <Navigate to="/login" />;
}

if (!authService.isAdmin()) {
    return <Navigate to="/login" />;
}

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("all");

    const vacationsPerPage = 9;

    async function loadVacations(): Promise<void> {
        try {
            setLoading(true);
            const data = await vacationService.getAllVacations();
            setVacations(data);
        }
        catch (err: any) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVacations();
    }, []);

    async function addLike(vacationId: number): Promise<void> {
        try {
            await vacationService.addLike(vacationId);

            setVacations(prev =>
                prev.map(v =>
                    v.vacationId === vacationId
                        ? { ...v, isLiked: 1, likesCount: v.likesCount + 1 }
                        : v
                )
            );
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    async function removeLike(vacationId: number): Promise<void> {
        try {
            await vacationService.removeLike(vacationId);

            setVacations(prev =>
                prev.map(v =>
                    v.vacationId === vacationId
                        ? { ...v, isLiked: 0, likesCount: Math.max(v.likesCount - 1, 0) }
                        : v
                )
            );
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    async function deleteVacation(vacationId: number): Promise<void> {
        const isConfirmed = window.confirm("Are you sure you want to delete this vacation?");
         if (!isConfirmed) return;
         
        try {
            await vacationService.deleteVacation(vacationId);
            notify.success("Vacation deleted.");
            setVacations(prev => prev.filter(v => v.vacationId !== vacationId));
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    function changeFilter(newFilter: string): void {
        setFilter(newFilter);
        setCurrentPage(1);
    }

    const filteredVacations = vacationService.filterVacations(filter, vacations);

    const totalPages = vacationService.getTotalPages(filteredVacations, vacationsPerPage);
    const vacationsForCurrentPage = vacationService.paginateVacations(
        filteredVacations,
        currentPage,
        vacationsPerPage
    );

    return (
        <div>
            <h2>Vacations</h2>

            <div className="Filters">
                <button onClick={() => changeFilter("all")}>All Vacations</button>
                <button onClick={() => changeFilter("liked")}>Liked Vacations</button>
                <button onClick={() => changeFilter("active")}>Active Vacations</button>
                <button onClick={() => changeFilter("future")}>Future Vacations</button>
            </div>

            {loading && <p>Loading...</p>}

            <div className="VacationsContainer">
                {vacationsForCurrentPage.map(v => (
                    <VacationCard
                        key={v.vacationId}
                        vacation={v}
                        onLike={addLike}
                        onUnlike={removeLike}
                        onDelete={deleteVacation}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="Pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            disabled={page === currentPage}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Vacations;
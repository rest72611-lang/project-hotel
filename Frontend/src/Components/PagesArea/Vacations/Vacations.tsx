import { useEffect, useState } from "react";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./Vacations.css";
import VacationCard from "./VacationCard";
import { authService } from "../../../Services/AuthService";
import { Link, Navigate } from "react-router-dom";

function Vacations() {
    if (!authService.isLoggedIn()) {
        return <Navigate to="/login" />;
    }

    const isAdmin = authService.isAdmin();
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("all");

    const vacationsPerPage = 9;

    async function loadVacations(): Promise<void> {
        try {
            setLoading(true);
            // One fetch returns both generic vacation data and user-specific like state.
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

            // Update the local list optimistically so the UI feels instant after the request succeeds.
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

            // Clamp the count at zero to avoid bad UI state if stale data slips through.
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
        // Reset to page 1 so the active page never points beyond the filtered result set.
        setFilter(newFilter);
        setCurrentPage(1);
    }

    const filteredVacations = vacationService.filterVacations(filter, vacations);
    const likedVacationsCount = vacations.filter(v => v.isLiked === 1).length;
    const activeVacationsCount = vacationService.filterVacations("active", vacations).length;
    const futureVacationsCount = vacationService.filterVacations("future", vacations).length;

    const totalPages = vacationService.getTotalPages(filteredVacations, vacationsPerPage);
    const vacationsForCurrentPage = vacationService.paginateVacations(
        filteredVacations,
        currentPage,
        vacationsPerPage
    );

    return (
        <div className="VacationsPage">
            <div className="VacationsPageHeader">
                <div>
                    <h2>Vacations</h2>
                    <p>
                        {isAdmin
                            ? "Review the published vacation catalog and manage every listing from one place."
                            : "Browse future trips, filter by status, and manage favorites in a cleaner travel dashboard."}
                    </p>
                </div>
                {isAdmin && (
                    <Link className="VacationsAdminAddButton" to="/admin/add-vacation">
                        Add Vacation
                    </Link>
                )}
            </div>

            <div className="VacationsOverviewGrid">
                <div className="VacationsOverviewCard">
                    <span className="VacationsOverviewLabel">All Vacations</span>
                    <strong>{vacations.length}</strong>
                </div>
                <div className="VacationsOverviewCard">
                    <span className="VacationsOverviewLabel">Liked</span>
                    <strong>{likedVacationsCount}</strong>
                </div>
                <div className="VacationsOverviewCard">
                    <span className="VacationsOverviewLabel">Active Now</span>
                    <strong>{activeVacationsCount}</strong>
                </div>
                <div className="VacationsOverviewCard">
                    <span className="VacationsOverviewLabel">Upcoming</span>
                    <strong>{futureVacationsCount}</strong>
                </div>
            </div>

            <div className="Filters">
                <button className={filter === "all" ? "ActiveFilter" : ""} onClick={() => changeFilter("all")}>All Vacations</button>
                <button className={filter === "liked" ? "ActiveFilter" : ""} onClick={() => changeFilter("liked")}>Liked Vacations</button>
                <button className={filter === "active" ? "ActiveFilter" : ""} onClick={() => changeFilter("active")}>Active Vacations</button>
                <button className={filter === "future" ? "ActiveFilter" : ""} onClick={() => changeFilter("future")}>Future Vacations</button>
            </div>

            {loading && (
                <div className="VacationsSkeletonGrid">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div key={index} className="VacationSkeletonCard">
                            <div className="VacationSkeletonHeader" />
                            <div className="VacationSkeletonImage" />
                            <div className="VacationSkeletonLine VacationSkeletonLineWide" />
                            <div className="VacationSkeletonMetaGrid">
                                <div className="VacationSkeletonMeta" />
                                <div className="VacationSkeletonMeta" />
                                <div className="VacationSkeletonMeta" />
                                <div className="VacationSkeletonMeta" />
                            </div>
                            <div className="VacationSkeletonLine" />
                            <div className="VacationSkeletonActions">
                                <div className="VacationSkeletonButton" />
                                <div className="VacationSkeletonButton" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredVacations.length === 0 && (
                <div className="VacationsEmptyState">
                    <h3>No vacations match this filter yet.</h3>
                    <p>
                        Try switching to another filter to explore more results,
                        or come back later after new vacations are added.
                    </p>
                    <button onClick={() => changeFilter("all")}>Show All Vacations</button>
                </div>
            )}

            {!loading && filteredVacations.length > 0 && (
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
            )}

            {!loading && totalPages > 1 && (
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

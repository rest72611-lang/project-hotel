import { VacationModel } from "../Models/VacationModel";
import { appConfig } from "../Utils/AppConfig";
import { api } from "./Service";

// Concentrates vacation-related client logic so components can stay focused on rendering and UX.
class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        const response = await api.get<VacationModel[]>(appConfig.vacationsUrl);
        return response.data;
    }

    public exportLikesCsv(vacations: VacationModel[]): void {
        let csv = "\uFEFF";
        csv += "Destination,Likes\n";

        for (const vacation of vacations) {
            const destination = `"${vacation.destination.replace(/"/g, '""')}"`;
            const likesCount = vacation.likesCount ?? 0;

            csv += `${destination},${likesCount}\n`;
        }

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Vacation Likes.csv";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        window.URL.revokeObjectURL(url);
    }

    public filterVacations(filter: string, vacations: VacationModel[]): VacationModel[] {
        const now = new Date();

        if (filter === "liked") {
            // isLiked is computed by the backend for the current user.
            return vacations.filter(v => v.isLiked === 1);
        }

        if (filter === "active") {
            return vacations.filter(v => {
                const startDate = new Date(v.startDate);
                const endDate = new Date(v.endDate);
                return startDate <= now && endDate >= now;
            });
        }

        if (filter === "future") {
            return vacations.filter(v => {
                const startDate = new Date(v.startDate);
                return startDate > now;
            });
        }

        return vacations;
    }

    public async addLike(vacationId: number): Promise<void> {
        await api.post(`${appConfig.likesUrl}/${vacationId}`, {});
    }

    public async removeLike(vacationId: number): Promise<void> {
        await api.delete(`${appConfig.likesUrl}/${vacationId}`);
    }

    public async addVacation(vacation: VacationModel, image?: File): Promise<void> {
        const formData = new FormData();

        // Dates are trimmed to YYYY-MM-DD because the backend validation expects date-only strings.
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate.slice(0, 10));
        formData.append("endDate", vacation.endDate.slice(0, 10));
        formData.append("price", String(vacation.price));

        if (image) {
            formData.append("image", image);
        }

        await api.post(appConfig.vacationsUrl, formData);
    }

    public async updateVacation(vacation: VacationModel, image?: File): Promise<void> {
        const formData = new FormData();

        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate.slice(0, 10));
        formData.append("endDate", vacation.endDate.slice(0, 10));
        formData.append("price", String(vacation.price));

        if (image) {
            formData.append("image", image);
        }

        await api.put(`${appConfig.vacationsUrl}/${vacation.vacationId}`, formData);
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        await api.delete(`${appConfig.vacationsUrl}/${vacationId}`);
    }

    public getTotalPages(items: VacationModel[], itemsPerPage: number): number {
        return Math.ceil(items.length / itemsPerPage);
    }

    public paginateVacations(
        vacations: VacationModel[],
        currentPage: number,
        vacationsPerPage: number
    ): VacationModel[] {
        // Pagination stays client-side because the dataset is small for this project.
        const startIndex = (currentPage - 1) * vacationsPerPage;
        const endIndex = startIndex + vacationsPerPage;
        return vacations.slice(startIndex, endIndex);
    }
}

export const vacationService = new VacationService();

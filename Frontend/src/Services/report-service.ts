import { ReportModel } from "../Models/report-model";
import { authService } from "./AuthService";
import { vacationService } from "./VacationService";

// The report is derived on the client from the vacations payload instead of a dedicated report API.
class ReportService {

    public async getVacationsReport(): Promise<ReportModel[]> {
        const user = authService.getUser();

        if (!user) {
            throw new Error("User is not logged in.");
        }

        const vacations = await vacationService.getAllVacations();

        // Keep only the fields the chart/export flow actually needs.
        return vacations.map(v => ({
            destination: v.destination,
            likesCount: v.likesCount
        }));
    }
}

export const reportService = new ReportService();

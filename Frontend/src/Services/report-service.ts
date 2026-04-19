import { ReportModel } from "../Models/report-model";
import { authService } from "./AuthService";
import { vacationService } from "./VacationService";



class ReportService {

    public async getVacationsReport(): Promise<ReportModel[]> {
        const user = authService.getUser();

        if (!user) {
            throw new Error("User is not logged in.");
        }

        const vacations = await vacationService.getAllVacations();

        return vacations.map(v => ({
            destination: v.destination,
            likesCount: v.likesCount
        }));
    }
}

export const reportService = new ReportService();
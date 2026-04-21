import { ResultSetHeader, RowDataPacket } from "mysql2";
import { dal } from "../2-utils/dal";
import { fileSaver } from "../2-utils/file-saver";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { VacationModel } from "../3-models/vacation-model";
import { validateVacation } from "../3-models/vacation-validation";

// Encapsulates vacation persistence and the small amount of file lifecycle coordination around it.
class VacationsService {

    public async getAllVacations(userId: number): Promise<RowDataPacket[]> {
        const sql = `
            SELECT 
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price,
                v.imageName,
                COUNT(l.userId) AS likesCount,
                MAX(CASE WHEN l.userId = ? THEN 1 ELSE 0 END) AS isLiked
            FROM vacations v
            LEFT JOIN likes l ON v.vacationId = l.vacationId
            GROUP BY
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price,
                v.imageName
            ORDER BY v.startDate ASC
        `;

        // Returning likesCount + isLiked from the query keeps the UI simple and avoids N+1 lookups.
        return await dal.execute(sql, [userId]) as RowDataPacket[];
    }

    public async getOneVacation(vacationId: number): Promise<RowDataPacket> {
        const sql = `SELECT * FROM vacations WHERE vacationId = ?`;
        const vacations = await dal.execute(sql, [vacationId]) as RowDataPacket[];

        if (vacations.length === 0) {
            throw new ResourceNotFoundError(vacationId);
        }

        return vacations[0];
    }

    public async addVacation(vacation: VacationModel): Promise<object> {
        validateVacation(vacation, { requireImage: true, allowPastDates: false });

        let imageName: string | null = null;
        // Only the generated filename is persisted; the binary file lives on disk.
        if (vacation.image) imageName = await fileSaver.saveImage(vacation.image);

        const sql = `
            INSERT INTO vacations (destination, description, startDate, endDate, price, imageName)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const result = await dal.execute(sql, [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            imageName
        ]) as ResultSetHeader;

        return { ...vacation, vacationId: result.insertId, imageName };
    }

    public async updateVacation(vacationId: number, vacation: VacationModel): Promise<object> {
        validateVacation(vacation, { requireImage: false, allowPastDates: true });

        const existingVacation = await this.getOneVacation(vacationId);
        let imageName = existingVacation.imageName as string | null;

        if (vacation.image) {
            // Replace the old file only when a new upload was supplied.
            if (imageName) fileSaver.deleteImage(imageName);
            imageName = await fileSaver.saveImage(vacation.image);
        }

        const sql = `
            UPDATE vacations
            SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ?
            WHERE vacationId = ?
        `;

        await dal.execute(sql, [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            imageName,
            vacationId
        ]);

        return { ...vacation, vacationId, imageName };
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        const vacation = await this.getOneVacation(vacationId);

        if (vacation.imageName) {
            // Cleaning the file here keeps database and filesystem state in sync.
            fileSaver.deleteImage(vacation.imageName as string);
        }

        const sql = `DELETE FROM vacations WHERE vacationId = ?`;
        await dal.execute(sql, [vacationId]);
    }
}

export const vacationsService = new VacationsService();

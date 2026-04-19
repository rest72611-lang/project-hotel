import { RowDataPacket } from "mysql2";
import { dal } from "../2-utils/dal";
import { ConflictError } from "../3-models/client-errors";

class LikesService {

    public async addLike(userId: number, vacationId: number): Promise<void> {
        const checkSql = `SELECT * FROM likes WHERE userId = ? AND vacationId = ?`;
        const existing = await dal.execute(checkSql, [userId, vacationId]) as RowDataPacket[];

        if (existing.length > 0) {
            throw new ConflictError("Vacation already liked.");
        }

        const sql = `INSERT INTO likes (userId, vacationId) VALUES (?, ?)`;
        await dal.execute(sql, [userId, vacationId]);
    }

    public async removeLike(userId: number, vacationId: number): Promise<void> {
        const sql = `DELETE FROM likes WHERE userId = ? AND vacationId = ?`;
        await dal.execute(sql, [userId, vacationId]);
    }
}

export const likesService = new LikesService();
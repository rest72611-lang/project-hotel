import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { dal } from "../2-utils/dal";
import { cyber } from "../2-utils/cyber";
import { ConflictError, UnauthorizedError } from "../3-models/client-errors";
import { Role } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-model";
import { UserModel } from "../3-models/user-model";
import { validateCredentials } from "../3-models/credentials-validation";
import { validateUser } from "../3-models/user-validation";

// Centralizes authentication rules so controllers stay thin and transport-focused.
class AuthService {

    private readonly saltRounds = 10;

    public async register(user: UserModel): Promise<string> {
        // Validate early so the database layer only sees normalized, expected input.
        validateUser(user);

        const sqlCheck = `SELECT userId FROM users WHERE email = ?`;
        const existingUsers = await dal.execute(sqlCheck, [user.email]) as RowDataPacket[];

        if (existingUsers.length > 0) {
            throw new ConflictError("Email already exists.");
        }

        const salt = await bcrypt.genSalt(this.saltRounds);
        const passwordHash = await bcrypt.hash(user.password as string, salt);

        const sqlInsert = `
            INSERT INTO users (firstName, lastName, email, passwordHash, role)
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = await dal.execute(sqlInsert, [
            user.firstName,
            user.lastName,
            user.email,
            passwordHash,
            // New registrations are intentionally always regular users.
            Role.User
        ]) as ResultSetHeader;

        // The client relies on the JWT payload as the single source of user identity.
        return cyber.createToken({
            userId: result.insertId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: Role.User
        });
    }

    public async login(credentials: CredentialsModel): Promise<string> {
        // Login uses the same validation contract as register to keep error handling predictable.
        validateCredentials(credentials);

        const sql = `SELECT * FROM users WHERE email = ?`;
        const users = await dal.execute(sql, [credentials.email]) as RowDataPacket[];

        if (users.length === 0) {
            throw new UnauthorizedError("Incorrect email or password.");
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedError("Incorrect email or password.");
        }

        // The token mirrors the database role so the UI can react without another round-trip.
        return cyber.createToken({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    }
}

export const authService = new AuthService();

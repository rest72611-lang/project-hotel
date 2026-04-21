import mysql2, { PoolOptions, QueryError, QueryResult } from "mysql2";
import { appConfig } from "./app-config";

// Minimal data-access layer that exposes a promise-based query API over a shared connection pool.
class Dal {

    private readonly options: PoolOptions = {
        host: appConfig.mysqlHost,
        user: appConfig.mysqlUser,
        password: appConfig.mysqlPassword,
        database: appConfig.mysqlDatabase,
        charset: "utf8mb4"
    };

    private readonly connection = mysql2.createPool(this.options);

    public execute(sql: string, values?: (string | number | null)[]): Promise<QueryResult> {
        return new Promise<QueryResult>((resolve, reject) => {
            this.connection.query(sql, values, (err: QueryError | null, result: QueryResult) => {
                if (err) {
                    // Callers handle translation of database failures into API-friendly errors.
                    reject(err);
                    return;
                }
                resolve(result);
            });

        });
    }
}

export const dal = new Dal();

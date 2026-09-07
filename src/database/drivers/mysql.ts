import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import type { DatabaseConnection } from './types';

type MySqlDatabase = ReturnType<typeof drizzle>;

export function createMySqlDatabase(
    url: string,
): DatabaseConnection<MySqlDatabase> {
    const pool = mysql.createPool(url);
    const db = drizzle({
        client: pool,
    });

    return {
        dialect: 'mysql',
        db,
        async close() {
            await pool.end();
        },
    };
}

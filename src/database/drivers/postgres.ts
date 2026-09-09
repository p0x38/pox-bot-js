import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import type { DatabaseConnection } from './types';

type PostgresDatabase = ReturnType<typeof drizzle>;

export function createPostgresDatabase(
    url: string,
): DatabaseConnection<PostgresDatabase> {
    const pool = new Pool({
        connectionString: url,
    });

    const db = drizzle({
        client: pool,
    });

    return {
        dialect: 'postgresql',
        db,
        async close() {
            await pool.end();
        },
    };
}

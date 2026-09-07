import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export function createPostgresDatabase(url: string) {
    const pool = new Pool({
        connectionString: url,
    });

    const db = drizzle({
        client: pool,
    });

    return {
        db,
        pool,
    };
}

import { DatabaseSync } from 'node:sqlite';

import { drizzle } from 'drizzle-orm/node-sqlite';

import type { DatabaseConnection } from './types';

type SqliteDatabase = ReturnType<typeof drizzle>;

export function createSqliteDatabase(
    path: string,
): DatabaseConnection<SqliteDatabase> {
    const client = new DatabaseSync(path);
    const db = drizzle({
        client,
    });

    return {
        dialect: 'sqlite',
        db,
        async close() {
            client.close();
        },
    };
}

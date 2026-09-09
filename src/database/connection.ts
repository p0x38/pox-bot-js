import type { DatabaseConfig } from './config';
import { createMySqlDatabase } from './drivers/mysql';
import { createPostgresDatabase } from './drivers/postgres';
import { createSqliteDatabase } from './drivers/sqlite';
import type { DatabaseConnection } from './drivers/types';

export function createDatabase(config: DatabaseConfig): DatabaseConnection {
    switch (config.dialect) {
        case 'postgresql':
            return createPostgresDatabase(config.url);

        case 'mysql':
            return createMySqlDatabase(config.url);

        case 'sqlite':
            return createSqliteDatabase(config.url);
    }
}

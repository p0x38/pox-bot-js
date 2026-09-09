export type DatabaseDialect = 'postgresql' | 'mysql' | 'sqlite';

export interface DatabaseConfig {
    dialect: DatabaseDialect;
    /**
     * PostgreSQL/MySQL connection URL or SQLite database file path.
     */
    url: string;
}

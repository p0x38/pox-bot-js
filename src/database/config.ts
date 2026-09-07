export type DatabaseDialect = 'postgresql' | 'mysql' | 'sqlite';

export interface DatabaseConfig {
    dialect: DatabaseDialect;
    url: string;
}

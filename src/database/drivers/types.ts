import type { DatabaseDialect } from '../config';

export interface DatabaseConnection<TDatabase = unknown> {
    readonly dialect: DatabaseDialect;
    readonly db: TDatabase;
    close(): Promise<void>;
}

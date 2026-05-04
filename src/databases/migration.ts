import path from 'node:path';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { pool } from './pool';
import logger from '../logger';

export async function runMigrations() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const categories = ['tables', 'indexes', 'views'];
        const paths = [
            path.join(process.cwd(), 'dist/assets/migrations'),
            path.join(process.cwd(), 'src/assets/migrations'),
        ];
        let baseDir = '';
        for (const p of paths) {
            if (existsSync(p)) {
                baseDir = p;
                break;
            }
        }

        if (!baseDir) {
            logger.warn('Migration directory not found, skipping migrations.');
            return;
        }

        for (const category of categories) {
            const dir = path.join(baseDir, category);
            if (!existsSync(dir)) continue;

            const files = readdirSync(dir).sort();
            for (const file of files) {
                const sql = readFileSync(path.join(dir, file), 'utf8');
                await client.query(sql);
                logger.info(`Migration applied: ${category}/${file}`);
            }
        }

        await client.query('COMMIT');
        logger.info('All migrations completed successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Migration failed! Rolled changes back.', error);
        throw error;
    } finally {
        client.release();
    }
}

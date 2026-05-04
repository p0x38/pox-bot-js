import { db } from '../databases';
import { runMigrations } from '../databases/migration';
import logger from '../logger';

async function init() {
    try {
        logger.info('Trying to initialize database...');

        await runMigrations();

        logger.info('Completely initialized!');
    } catch (err) {
        logger.error('An error raised trying to initialize database:', err);
    } finally {
        await db.pool.end();
        process.exit();
    }
}

init();

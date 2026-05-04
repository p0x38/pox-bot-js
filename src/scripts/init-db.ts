import fs from 'fs';
import path from 'path';
import { db } from '../databases';
import logger from '../logger';

async function init() {
    try {
        logger.info('Trying to initialize database...');

        const sqlPath = path.join(__dirname, '../../resources/sql/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await db.query(sql);

        logger.info('Completely initialized!');
    } catch (err) {
        logger.error('An error raised trying to initialize database:', err);
    } finally {
        await db.pool.end();
        process.exit();
    }
}

init();

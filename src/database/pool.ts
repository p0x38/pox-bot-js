import { Pool } from 'pg';

import 'dotenv/config';
import { logger } from '@/logger';

export const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: parseInt(process.env.PGPORT || '5432'),
});

pool.on('connect', () => {
    logger.info('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    logger.error('PostgreSQL raised an error:', err);
});
